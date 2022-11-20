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
        console.log(publicAddress) 
        console.log(_owner)
        console.log(isOwner)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {
        (isWalletConnected) ? (
          <div>
            <h1>Connected address {publicAddress}</h1>
          </div>
        ) : (
          <div>
            <h1>Install Metamask</h1>
          </div>
        )
      }
    </div>
  )
}

export default Home