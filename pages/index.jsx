import Head from 'next/head'
import Image from 'next/image'
import{ useState, useEffect, useRef} from 'react'
import {providers, Contract, ethers, Signer} from 'ethers'
import Web3Modal from 'web3modal';
import {contractAddress, abi} from '../constants'
import { get } from 'http';

const Home = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isOwner, setOwner] = useState(false)
  const [publicAddress, setPublicAddres] = useState("")
  const [loading, setLoading] = useState(false)
  const [uriUrl, setUriUrl] = useState("")
  const [copies, setCopies] = useState(0)
  const [tokenId, setTokenId] = useState(0)

  const web3ModalRef = useRef();

  useEffect(() => {
    if(!isWalletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });  
    }
    connectWallet()

  }, [isWalletConnected])

  const getProviderOrSigner = async(needSigner = false) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    if(needSigner) {
      const Signer = web3Provider.getSigner()
      return Signer;
    }
  }

  const connectWallet = async() => {
    try {
      const signer = await getProviderOrSigner(true)
      const _publicAddress = await signer.getAddress()
      setPublicAddres(_publicAddress)
      await getOwner()
      setIsWalletConnected(true)
    } catch (error) {
      console.log(error)
    }
  }

  const getOwner = async() => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(contractAddress, abi, signer)
      const _owner = await nftContract.owner()
      const _publicAddress = await signer.getAddress()
      if(_publicAddress === _owner){
        setOwner(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fixUri = async() => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(contractAddress, abi, signer)
      const res = await nftContract.setURI(uriUrl)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const mint = async (e) => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(contractAddress, abi, signer)
      const response = await nftContract.mint(publicAddress, tokenId, copies, [])
      window.alert(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {
        (isWalletConnected) ? (
          <div>
            <h1 className='bg-blue-900 text-white rounded-md p-3 m-4'>Connected address {publicAddress}</h1>
          </div>
        ) : (
          <div>
            <h1>Install Metamask</h1>
          </div>
        )
      }
      {
        (isWalletConnected)? 
        (
          <div>
            <section className='flex justify-evenly p-2 border-2 bg-blue-400'>
              <input 
              type={'text'} 
              value={uriUrl} 
              className='border-2 '
              placeholder='URI url'
              onChange={(e)=> setUriUrl(e.target.value)}/>
              <button onClick={fixUri} className='bg-blue-900 text-white rounded-md p-2 m-1'>
                Set URI
              </button>
            </section>
            <section className='flex p-2 items-center border-2 bg-blue-400'>
              <label className='m-1'>no. of copies</label>
              <input
              type={'number'}
              placeholder="no. of copies"
              className='m-1 p-1'
              value={copies}
              onChange={(e)=> setCopies(e.target.value)}
              />
              <label className='m-1'>tokenId</label>
              <input
              type={'number'}
              placeholder="tokenId"
              className='m-1 p-1'
              value={tokenId}
              onChange={(e)=> setTokenId(e.target.value)}
              />
              <button onClick={mint} className='bg-blue-900 text-white rounded-md p-2 m-1'>
                mint
              </button>
            </section>
          </div>
        ) :(
          <div></div>
        )
      }
    </div>
  )
}

export default Home