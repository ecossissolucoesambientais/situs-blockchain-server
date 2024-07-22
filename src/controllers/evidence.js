const Evidence = require('../models/evidence')
const Image = require('../models/image')
const Point = require('../models/point')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { ethers } = require('ethers');


// List all evidences
exports.list = async (req, res) => {
  try {
    const evidences = await Evidence
      .find()
    return res.status(200).send(evidences)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar evidências' })
  }
}

exports.listEvidencesFromPoint = async (req, res) => {
  try {
    const evidences = await Evidence
      .find({point: req.params.id})
    // Criar uma cópia das evidências para evitar mutação direta
    let aux_evidencias = evidences.map(evidencia => ({ ...evidencia._doc, images: [] }));

    for (let i = 0; i < aux_evidencias.length; i++) {
      try {
        // Buscar imagens relacionadas à evidência
        const images = await Image.find({ refModel: 'Evidence', refId: aux_evidencias[i]._id });
        aux_evidencias[i].images = images;
        console.log(aux_evidencias[i].images);
      } catch (error) {
        console.error(`Erro ao buscar imagens para a evidência ${aux_evidencias[i]._id}:`, error);
      }
    }
    console.log(aux_evidencias);
    return res.status(200).send(aux_evidencias);
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar evidências' })
  }
}

// List all images from this evidence
exports.images = async (req, res) => {
  try {
    const images = await Image
      .find({refModel: 'Evidence', refId: req.params.id})
    return res.status(200).send(images)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar imagens' })
  }
}

// Get evidence by ID
exports.show = async (req, res) => {
  try {
    const evidence = await Evidence
      .findById(req.params.id)
      res.status(200).send(evidence)
  } catch (err) {
    return res.status(400).send({ error: 'Evidência não encontrada' })
  }
}


// Create evidence
exports.new = async (req, res) => {
  try {
    const {
      type, quantity, note, depth, soilTexture,
      soilColor, soilConsistency, point
    } = req.body

    const evidence_exists = await Evidence
      .find({
        type, quantity, note, depth, soilTexture,
        soilColor, soilConsistency, point
      })

    if (evidence_exists.length === 0) {
      const evidence = await Evidence.create({... req.body,
        createUser: req.userId,
        updateUser: req.userId
      })
      pdfSuccess = await gerarPDF(evidence._id)      
      return res.status(200).send(evidence)
    } else
      return res.status(200).send({ error: "Evidência já cadastrada." })
  } catch (err) {
    return res.status(400).send({ error: err })
  }
}

// Update evidence by ID
exports.update = async (req, res) => {
  try {    
    const evidence = await Evidence
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (evidence) {
        res.status(200).send({ message: 'Evidência atualizada', evidence })
      } else {
        return res.status(400).send({ error: 'Evidência não encontrada' })
      }
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao atualizar evidência' })
  }
}

// Remove evidence by ID
exports.delete = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndRemove(req.params.id)
      if (evidence) {
        res.status(200).send({ message: 'Evidência removida', Evidence })
      }
      else {
        return res.status(400).send({ error: 'Evidência não encontrada' })
      }
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao remover evidência' })
  }
}

exports.generateEvidencePDF = async (req, res) => {
  try {
    const evidenceId = req.params.id;
    const evidence = await Evidence.findById(evidenceId).populate('point');

    if (!evidence) {
      return res.status(404).send({ error: 'Evidência não encontrada' });
    }

    const point = await Point.findById(evidence.point._id);

    if (!point) {
      return res.status(404).send({ error: 'Ponto não encontrado' });
    }

    // Buscando a imagem relacionada à evidência
    const image = await Image.findOne({ refId: evidenceId, refModel: 'Evidence' });
    console.log(image.key)

    const doc = new PDFDocument();

    // Defina o caminho onde o PDF será salvo temporariamente
    const filePath = `${process.env.EVIDENCES_FOLDER}/evidence_${evidenceId}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));

    // Adicione conteúdo ao PDF
    doc.fontSize(20).text('Relatório de Evidência', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).text('Detalhes da Evidência');
    doc.fontSize(12).text(`Título: ${evidence.title}`);
    doc.text(`Descrição: ${evidence.note}`);
    doc.text(`Criado por: ${evidence.createUser}`);
    doc.text(`Data de Criação: ${evidence.createDate}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Detalhes do Ponto');
    doc.fontSize(12).text(`Nome do Ponto: ${point.name}`);
    doc.text(`Coordenadas: [${point.location.coordinates[1]}, ${point.location.coordinates[0]}]`);
    doc.text(`Criado por: ${point.createUser}`);
    doc.text(`Data de Criação: ${point.createDate}`);

    if (image) {
      doc.fontSize(16).text('Imagem:', { align: 'left' });
      doc.moveDown();

      // Adicionando a imagem ao PDF
      doc.image(`${process.env.IMAGES_FOLDER}/${image.key}`, {
        fit: [500, 400],
        align: 'center',
        valign: 'center'
      });
      doc.moveDown();
    }


    doc.end();
    res.status(200).send({ message: 'PDF gerado com sucesso!', evidence })

  } catch (err) {
    console.error('Erro ao gerar o PDF:', err);
    return res.status(500).send({ error: 'Erro ao gerar o PDF', message: err.message || undefined });
  }
};

exports.nftMint = async(req, res) => {
  const PinataSDK = require('@pinata/sdk');
  const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET); 
  const filename = "evidences/evidence_669d56b83c5c2ec00cd5682c.pdf";

  const readableStreamForFile = fs.createReadStream(filename);
  const options = {
      pinataMetadata: {
          name: filename,
      },
      pinataOptions: {
          cidVersion: 0
      }
  };

  try {
      const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      console.log('IPFS Hash:', result.IpfsHash);

      const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

      // ABI e Endereço do Contrato
      const contractABI = JSON.parse(fs.readFileSync('0x6f40b988e4bbfdaa47ea18380cee4a61ff99421e.json', 'utf8')); 
      const contractAddress = process.env.CONTRACT_ADDRESS;
    
      // Chave Privada
      const privateKey = process.env.METAMASK_PRIVATE_KEY;
    
      // Função para mintar um NFT
    
      const recipientAddress = process.env.RECEIVER_ADDRESS; 
      const hash = result.IpfsHash; // Substituir pelo hash recebido do Situs
    
      const wallet = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
      try {
          const tx = await contract.mintNFT(recepientAddress, hash);
          await tx.wait(); // Esperar a transação ser minerada
          console.log('Transaction Hash:', tx.hash); // Log do hash da transação
      } catch (error) {
          console.error('Erro ao mintar o NFT:', error);
      }
    

      return res.status(200).send({ message: 'Carregado no IPFS com sucesso', result });
  } catch (err) {
      console.error('Erro ao carregar no IPFS:', err);
      return res.status(500).send({ error: 'Erro ao carregar no IPFS', err });
  }

} 


async function gerarPDF(evidenceId) {
  try {
    const evidence = await Evidence.findById(evidenceId).populate('point');

    if (!evidence) {
      return { error: 'Evidência não encontrada' };
    }

    const point = await Point.findById(evidence.point._id);

    if (!point) {
      return { error: 'Ponto não encontrado' };
    }

    // Buscando a imagem relacionada à evidência
    const image = await Image.findOne({ refId: evidenceId, refModel: 'Evidence' });
    console.log(image ? image.key : 'Nenhuma imagem encontrada');

    const doc = new PDFDocument();

    // Defina o caminho onde o PDF será salvo temporariamente
    const filePath = `${process.env.EVIDENCES_FOLDER}/evidence_${evidenceId}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));

    // Adicione conteúdo ao PDF
    doc.fontSize(20).text('Relatório de Evidência', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).text('Detalhes da Evidência');
    doc.fontSize(12).text(`Título: ${evidence.title}`);
    doc.text(`Descrição: ${evidence.note}`);
    doc.text(`Criado por: ${evidence.createUser}`);
    doc.text(`Data de Criação: ${evidence.createDate}`);
    doc.moveDown();
    
    doc.fontSize(16).text('Detalhes do Ponto');
    doc.fontSize(12).text(`Nome do Ponto: ${point.name}`);
    doc.text(`Coordenadas: [${point.location.coordinates[1]}, ${point.location.coordinates[0]}]`);
    doc.text(`Criado por: ${point.createUser}`);
    doc.text(`Data de Criação: ${point.createDate}`);

    if (image) {
      doc.fontSize(16).text('Imagem:', { align: 'left' });
      doc.moveDown();

      // Adicionando a imagem ao PDF
      doc.image(`${process.env.IMAGES_FOLDER}/${image.key}`, {
        fit: [500, 400],
        align: 'center',
        valign: 'center'
      });
      doc.moveDown();
    }

    doc.end();
    nft = await nftMint(filePath)
    return { message: 'PDF gerado com sucesso!', filePath, evidence };

  } catch (err) {
    console.error('Erro ao gerar o PDF:', err);
    return { error: 'Erro ao gerar o PDF', message: err.message || undefined };
  }
}

async function nftMint(filename1) {
    const ethers = require('ethers');
    const PinataSDK = require('@pinata/sdk');  
    console.log("Iniciando o processo de mintagem do NFT...");
    
    const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
    const filename = "evidences/evidence_669d56b83c5c2ec00cd5682c.pdf";

    console.log("Verificando se o arquivo PDF existe...");
    if (!fs.existsSync(filename)) {
        console.error("Arquivo PDF não encontrado!");
        return { error: 'Arquivo PDF não encontrado' };
    }

    const readableStreamForFile = fs.createReadStream(filename);
    const options = {
        pinataMetadata: {
            name: filename,
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    try {
        console.log("Carregando arquivo no IPFS...");
        const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
        console.log('IPFS Hash:', result.IpfsHash);

        console.log("Configurando provedor JSON-RPC...");
        const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/5971694705114282831f37049324898d");

        console.log("Lendo ABI do contrato...");
        const contractABI = JSON.parse(fs.readFileSync('0xEcBcEE882FE736Ac452fa3d3ed67DC723E2dc462.json', 'utf8')); 
        const contractAddress = process.env.CONTRACT_ADDRESS;

        console.log("Configurando carteira...");
        const privateKey = process.env.METAMASK_PRIVATE_KEY;
        const recipientAddress = process.env.RECEIVER_ADDRESS; 
        const hash = result.IpfsHash; 

        console.log("Mintando o NFT...");
        await mint(recipientAddress, hash, privateKey, provider, contractAddress, contractABI);

        console.log("Processo de mintagem concluído com sucesso.");
        return true;
    } catch (err) {
        console.error('Erro durante o processo:', err);
    }
}

async function mint(toAddress, tokenURI, privateKey, provider, contractAddress, contractABI) {
    try {
        console.log("Inicializando a carteira...");
        const wallet = new ethers.Wallet(privateKey, provider);

        console.log("Conectando ao contrato...");
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        console.log("Executando a transação de mintagem...");
        const tx = await contract.mint(toAddress, tokenURI);
        await tx.wait(); // Esperar a transação ser minerada

        console.log('Transaction Hash:', tx.hash); // Log do hash da transação
    } catch (error) {
        console.error('Erro ao mintar o NFT:', error);
        throw error; // Re-lançar o erro para ser tratado na função chamadora
    }
}