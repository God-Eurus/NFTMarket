import React, { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { PixelEditor } from './components/PixelEditor';
import { supabase } from './lib/supabase';
import { motion } from "framer-motion";
import "@fortawesome/fontawesome-free/css/all.min.css";



interface NFT {
  id: string;
  name: string;
  price: string;
  image: string;
  creator_id: string;
  created_at: string;
}


const MANUAL_NFTS: NFT[] = [
  { id: '1', name: 'Pixel Warrior', price: '0.05', image: 'https://i2.seadn.io/base/0x286ce4278213bf7b561763ebcf2342bb94e52858/178f084e7c62cd61f223d11272c09fe1.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '2', name: 'Neon Ghost', price: '0.08', image: 'https://i2.seadn.io/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/850731fe930b31f2cc4817f8acf60119.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '3', name: 'Cyber Punk', price: '0.92', image: 'https://i2.seadn.io/base/0x286ce4278213bf7b561763ebcf2342bb94e52858/e902ca535c26c93efc902cdc680a13e4.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '4', name: 'Washie', price: '0.1', image: 'https://i2.seadn.io/ethereum/0x1d20a51f088492a0f1c57f047a9e30c9ab5c07ea/d8f2752b4eca424b9e3f2b56c20a0fd0.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '5', name: 'Tiknet', price: '0.34', image: 'https://i2.seadn.io/ethereum/0x1d20a51f088492a0f1c57f047a9e30c9ab5c07ea/af6f9508dbe530b94b418926738eeec1.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '6', name: 'Echo', price: '0.78', image: 'https://i2.seadn.io/ethereum/0x1d20a51f088492a0f1c57f047a9e30c9ab5c07ea/c76b4b967eed7b025ef648462e873dd4.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '1', name: 'Pixel Warrior', price: '0.05', image: 'https://i2.seadn.io/ronin/0x32950db2a7164ae833121501c797d79e7b79d74c/5102593e4115af6ae7a5b43dcc1e7f/685102593e4115af6ae7a5b43dcc1e7f.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '2', name: 'Neon Ghost', price: '0.08', image: 'https://i2.seadn.io/ronin/0x32950db2a7164ae833121501c797d79e7b79d74c/7ef0c774d200359afe82e69958bb91/517ef0c774d200359afe82e69958bb91.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '3', name: 'Cyber Punk', price: '0.92', image: 'https://i2.seadn.io/ronin/0x32950db2a7164ae833121501c797d79e7b79d74c/e8cd726a4f9a51af65c0d269d925ae/d6e8cd726a4f9a51af65c0d269d925ae.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '4', name: 'Washie', price: '0.1', image: 'https://i2.seadn.io/base/0xcc7b00f71d36e0ac5bffb42b49e1713869ab0bed/bd8afcb3e45eff6030c4fd7cc3c5eb/69bd8afcb3e45eff6030c4fd7cc3c5eb.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '5', name: 'Tiknet', price: '0.34', image: 'https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/10866443d430d77016e2a6a6befe8d/e410866443d430d77016e2a6a6befe8d.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '6', name: 'Echo', price: '0.78', image: 'https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/beb4090ede55d9c770b8a07b445857/fabeb4090ede55d9c770b8a07b445857.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '1', name: 'Pixel Warrior', price: '0.05', image: 'https://i2.seadn.io/ethereum/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/8b9fb728a808df5a44ee2ac1fd2360c6.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '2', name: 'Neon Ghost', price: '0.08', image: 'https://i2.seadn.io/ethereum/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/fbfb5a25f3b56e4133f2a67b9eb694a6.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '3', name: 'Cyber Punk', price: '0.92', image: 'https://i2.seadn.io/ethereum/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/d754e40d11e590ff8bca5e8f5b46c0e0.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '4', name: 'Washie', price: '0.1', image: 'https://i2.seadn.io/ethereum/0x5af0d9827e0c53e4799bb226655a1de152a425a5/bed0024abf9553bb792ab1af66139b64.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '5', name: 'Tiknet', price: '0.34', image: 'https://i2.seadn.io/ethereum/0x5af0d9827e0c53e4799bb226655a1de152a425a5/b5071514366fb3154ff532f376e0e798.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '6', name: 'Echo', price: '0.78', image: 'https://i2.seadn.io/ethereum/0x5af0d9827e0c53e4799bb226655a1de152a425a5/dabd77147816546f13b1a7f5b72348c1.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '6', name: 'Echo', price: '0.78', image: 'https://i2.seadn.io/ethereum/0xedb61f74b0d09b2558f1eeb79b247c1f363ae452/3616bb958c3381674ef2acd35e37b6e0.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '6', name: 'Echo', price: '0.78', image: 'https://i2.seadn.io/ethereum/0xedb61f74b0d09b2558f1eeb79b247c1f363ae452/3e540190bee6ad439a98964a977272f1.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },
  { id: '6', name: 'Echo', price: '0.78', image: 'https://i2.seadn.io/ethereum/0xedb61f74b0d09b2558f1eeb79b247c1f363ae452/56a48ec251933feba784d629415a626f.png?w=1000', creator_id: 'admin', created_at: new Date().toISOString() },


];

const CONTRACT_ADDRESS = '0xE06609d029DE41444E3BF38C459B6fbCdeD3eCCB';
const CONTRACT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
  },
];

function App() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNFT, setNewNFT] = useState<Partial<NFT>>({
    name: '',
    price: '',
    image: ''
  });

const handleDownloadNFT = () => {
 
  const nftData = {
    name: newNFT.name || "Unnamed NFT",
    price: newNFT.price || "0",
    image: `${newNFT.name || "nft"}.png`, // Reference the image filename
    description: "Created with PixelVerse",
    attributes: [], 
  };

 
  const metadataBlob = new Blob([JSON.stringify(nftData, null, 2)], {
    type: "application/json",
  });

  const metadataUrl = URL.createObjectURL(metadataBlob);
  const metadataLink = document.createElement("a");
  const safeName = (newNFT.name || "nft").replace(/[^a-z0-9]/gi, "_").toLowerCase();

  metadataLink.href = metadataUrl;
  metadataLink.download = `${safeName}-metadata.json`;
  document.body.appendChild(metadataLink);
  metadataLink.click();
  document.body.removeChild(metadataLink);

 
  if (newNFT.image?.startsWith("data:image")) {
    const imageLink = document.createElement("a");
    imageLink.href = newNFT.image;
    imageLink.download = `${safeName}.png`;
    document.body.appendChild(imageLink);
    imageLink.click();
    document.body.removeChild(imageLink);
  } else {
    alert("No image available to download.");
  }
};

  const { isConnected, address } = useAccount();
  const { write: mint, data: mintData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'mint',
  });

  const { isLoading: isMinting } = useWaitForTransaction({ hash: mintData?.hash });

  useEffect(() => {
    saveManualNFTs();
    fetchNFTs();
  }, []);

  async function saveManualNFTs() {
    try {
      const { data } = await supabase.from('nfts').select('id');
      const existingIds = data?.map(nft => nft.id) || [];

      const newNFTs = MANUAL_NFTS.filter(nft => !existingIds.includes(nft.id));

      if (newNFTs.length > 0) {
        await supabase.from('nfts').insert(newNFTs);
      }
    } catch (error) {
      console.error('Error saving manual NFTs:', error);
    }
  }

  async function fetchNFTs() {
    try {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const combinedNFTs = [...MANUAL_NFTS, ...(data || [])];
      setNfts(combinedNFTs);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      alert('Failed to fetch NFTs');
    }
  }

 const handleMint = async (id: string, price: string) => {
  if (!isConnected) {
    alert("Please connect your wallet first!");
    return;
  }

  if (!mint) {
    alert("Mint function is not ready yet.");
    return;
  }

  try {
    await mint({
      args: [BigInt(id)],
      value: parseEther(price),
    });
  } catch (err) {
    console.error("Mint error:", err);
    alert("Failed to mint. See console for details.");
  }
};


  const handleCreateNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!newNFT.name || !newNFT.price || !newNFT.image) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('nfts')
        .insert([
          {
            name: newNFT.name,
            price: newNFT.price,
            image: newNFT.image,
            creator_id: address
          }
        ]);

      if (error) throw error;

      setNewNFT({ name: '', price: '', image: '' });
      setShowCreateForm(false);
      fetchNFTs();
    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Failed to create NFT');
    }
  };

  const handleSavePixelArt = (dataUrl: string) => {
    setNewNFT(prev => ({ ...prev, image: dataUrl }));
  };

  return (
    <div className="min-h-screen bg-purple-900 text-white">
      {/* Navbar */}
      <header className="neon-navbar flex justify-between items-center p-6 bg-purple-800 shadow-lg">
        <h1 className="neon-logo text-3xl text-neon-pink">PixelVerse</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="retro-button"
          >
            {showCreateForm ? 'Cancel' : 'Create NFT'}
          </button>
          <ConnectButton className="wallet-button" />
        </div>
      </header>
 

<section className="relative py-24 text-center text-white shadow-lg">
  {/* Background Banner with Glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900 opacity-95 blur-sm"></div>

  <div className="relative z-10 max-w-3xl mx-auto px-6">
    {/* Animated Heading */}
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-6xl font-extrabold text-white drop-shadow-xl tracking-wide neon-text"
    >
      Welcome to the  
      <span className="text-neon-pink block mt-2 neon-glow">NFT Minting Marketplace</span>
    </motion.h2>

    {/* Styled Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-lg text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed tracking-wide"
    >
      Design, explore, and mint exclusive <span className="text-neon-blue font-semibold">pixel NFTs</span>  
      using our advanced editor or browse the marketplace for unique digital collectibles.
    </motion.p>

    {/* Learn More Button */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="mt-8"
    >
      <a 
        href="https://opensea.io/learn" 
        target="_blank" 
        rel="noopener noreferrer"
        className="px-6 py-3 text-xl font-semibold text-black bg-neon-blue rounded-lg shadow-lg hover:bg-neon-pink transition-all duration-300"
      >
        Learn More
      </a>
    </motion.div>
  </div>
</section>



   {showCreateForm && (
  <div className="container mx-auto mt-8 p-6 bg-purple-800 rounded-lg shadow-lg">
    <h2 className="text-2xl mb-4 text-neon-blue">Create New NFT</h2>
    <form className="space-y-4">
      <input
        type="text"
        placeholder="NFT Name"
        className="form-input"
        value={newNFT.name}
        onChange={(e) => setNewNFT({ ...newNFT, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="0.1 ETH"
        className="form-input"
        value={newNFT.price}
        onChange={(e) => setNewNFT({ ...newNFT, price: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL"
        className="form-input"
        value={newNFT.image}
        onChange={(e) => setNewNFT({ ...newNFT, image: e.target.value })}
      />
      <PixelEditor width={16} height={16} onSave={handleSavePixelArt} />
      {newNFT.image && <img src={newNFT.image} className="w-32 h-32 border-2 border-neon-blue" />}

      {/* Download NFT Metadata Button */}
      <button type="button" onClick={handleDownloadNFT} className="retro-button w-full">
        Download NFT Metadata
      </button>
    </form>
  </div>
)}



      {/* NFT Grid */}
      <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div key={nft.id} className="nft-card p-6 bg-purple-800 rounded-lg shadow-md">
            <img src={nft.image} className="w-full h-64 rounded-lg mb-4" />
            <h2 className="text-xl text-neon-blue">{nft.name}</h2>
            <p className="text-neon-green">{nft.price} ETH</p>
            <button onClick={() => handleMint(nft.id, nft.price)} className="retro-button">Mint NFT</button>
          </div>
        ))}
      </div>


      
        <footer className="relative mt-12 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white py-12">
  
  <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1600x900/?cyberpunk,neon')] bg-cover bg-center opacity-10"></div>

  <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
    
    
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-neon-pink mb-2">NFT Minting Marketplace</h2>
      <p className="text-gray-300 text-sm">
        Discover, collect, and mint exclusive digital assets with ease. Step into the future of Web3.
      </p>
    </div>

   
    <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
      {/* Navigation Links */}
      <div className="flex flex-wrap gap-6 text-gray-300 text-sm">
        <a href="https://yourwebsite.com/about" target="_blank" rel="noopener noreferrer" className="hover:text-neon-blue transition-all duration-300">
          About Us
        </a>
        <a href="https://opensea.io/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-neon-blue transition-all duration-300">
          Privacy Policy
        </a>
        <a href="https://opensea.io/tos" target="_blank" rel="noopener noreferrer" className="hover:text-neon-blue transition-all duration-300">
          Terms of Service
        </a>
      </div>

    
      <div className="mt-4 flex gap-4">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram text-2xl text-gray-400 hover:text-neon-pink transition-all duration-300"></i>
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github text-2xl text-gray-400 hover:text-neon-pink transition-all duration-300"></i>
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-x-twitter text-2xl text-gray-400 hover:text-neon-pink transition-all duration-300"></i>
        </a>
      </div>
    </div>
  </div>

  {/* Copyright & Legal Notice */}
  <p className="mt-6 text-xs text-gray-400 border-t border-gray-700 pt-4 text-center">
    © 2025 NFT Minting Marketplace. All rights reserved. | Crafted for Web3 Innovators 
  </p>
</footer>



    </div>
  );
  
  
}

export default App;
