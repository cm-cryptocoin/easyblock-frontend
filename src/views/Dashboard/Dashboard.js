import {useEffect} from 'react'
// Chakra imports
import {
    Box,
    Button,
    Flex,
    Grid,
    Icon,
    Image, Input, InputGroup,
    Portal,
    SimpleGrid,
    Spacer,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useColorMode,
    useColorModeValue,
    Spinner
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import IconBox from "components/Icons/IconBox";
// Custom icons
import {
    WalletIcon,
} from "components/Icons/Icons.js";
import React, {useState} from "react";
// react icons
import {BsArrowRight} from "react-icons/bs";
import {FiDollarSign} from "react-icons/fi"

import AdminNavbar from "../../components/Navbars/AdminNavbar.js";

import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, EASYBLOCK_ABI} from "../../contracts/EasyBlock";

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer = provider.getSigner();
const easyBlockContract = new ethers.Contract(CONTRACT_ADDRESS, EASYBLOCK_ABI, provider);
let easyBlockWithSigner = easyBlockContract.connect(signer);

export default function Dashboard() {
    // WEB3 START
    const [currentAccount, setCurrentAccount] = useState(null);

    const connectWalletHandler = async () => {
        signer = provider.getSigner();
    };

    const mintNftHandler = () => {
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    const mintNftButton = () => {
        return (
            <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
                Mint NFT
            </button>
        )
    };
    // WEB3 END
    const value = "$100.000";
    // Chakra Color Mode
    const {colorMode, toggleColorMode} = useColorMode();
    const iconTeal = useColorModeValue("teal.300", "teal.300");
    const iconBoxInside = useColorModeValue("white", "white");
    const textColor = useColorModeValue("gray.700", "white");

    // General stats
    const [totalInvestments, setTotalInvestments] = useState(0);
    const [totalRewardsPaid, setTotalRewardsPaid] = useState(0);
    const [totalShareCount, setTotalShareCount] = useState(60);
    const [strongPrice, setStrongPrice] = useState(0);
    const [nodesOwned, setNodesOwned] = useState(0);
    const [purchaseTokenContract, setPurchaseTokenContract] = useState("");
    const [sharePrice, setSharePrice] = useState(0);

    // User stats
    const [userShares, setUserShares] = useState(0);
    const [userPendingRewards, setUserPendingRewards] = useState(0);

    const [sharesToBeBought, setSharesToBeBought] = useState(10);

    const inputBg = useColorModeValue("white", "gray.800");

    const overlayRef = React.useRef();

    // UI CONTROLLERS
    const [isClaiming, setIsClaiming] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    useEffect(async () => {
        let totalInvestment = parseInt(await easyBlockContract.totalInvestmentsInUSD(), 10);
        let totalRewards = parseInt(await easyBlockContract.totalRewardsDistributedInUSD(), 10);
        let totalShares = parseInt(await easyBlockContract.totalShareCount(), 10);
        let purchaseTokenAddress = await easyBlockContract.purchaseTokens(0);
        let sharePriceInUSD = parseInt(await easyBlockContract.purchaseTokensPrice(purchaseTokenAddress), 10);
        let userShares = parseInt(await easyBlockContract.shareCount(signer.getAddress()), 10);
        // let totalNodesOwned = parseInt(await easyBlockContract.nodeCount(), 10);
        let claimableReward = parseInt(await easyBlockContract.claimableReward(signer.getAddress()), 10);

        console.log(claimableReward);

        setTotalInvestments(totalInvestment);
        setTotalRewardsPaid(totalRewards);
        setTotalShareCount(totalShares);
        setPurchaseTokenContract(purchaseTokenAddress);
        setSharePrice(sharePriceInUSD);
        setUserShares(userShares);
        // setNodesOwned(totalNodesOwned);
        setUserPendingRewards(claimableReward / 1000000);

        // Strong price from coin gecko
        fetch('https://api.coingecko.com/api/v3/coins/strong').then(response => response.json()).then(data => {
                let price = data.market_data.current_price.usd;
                setStrongPrice(price);
            }
        )

    }, [signer]);

    // CONTRACT INTERACTION FUNCTIONS
    async function claimRewards() {
        setIsClaiming(true);
        await easyBlockWithSigner.claimRewards();
    }

    async function buyShares(count) {
        setIsBuying(true);
        await easyBlockWithSigner.buyShares(purchaseTokenContract, count);
    }

    // CONTRACT EVENT LISTENERS

    return (
        <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 32}}>
            <Portal>
                <AdminNavbar
                    wallet={currentAccount}
                    connectWalletHandler={() => connectWalletHandler()}
                    setCurrentAccount={(newAccount) => setCurrentAccount(newAccount)}
                    logoText={"EasyBlock"}
                />
            </Portal>
            <Flex flexDirection="column" pt={{base: "120px", md: "75px"}} maxWidth={"1400px"} paddingLeft={0}
                  paddingRight={0}>
                <SimpleGrid columns={{sm: 1, md: 2, xl: 4}} spacing="24px" paddingLeft={0} paddingRight={0}>
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        StrongBlock APR/APY
                                    </StatLabel>
                                    <Flex>
                                        <StatNumber fontSize="lg" color={textColor}>
                                            365%
                                        </StatNumber>
                                        <StatHelpText
                                            alignSelf="flex-end"
                                            justifySelf="flex-end"
                                            m="0px"
                                            color="green.400"
                                            fontWeight="bold"
                                            ps="3px"
                                            fontSize="md"
                                        >
                                            {" /3778%"}
                                        </StatHelpText>
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <img style={{width: 36, height: 36}} src={'/stronblock/StrongBlockLogo.png'}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Total Investment
                                    </StatLabel>
                                    <Flex>
                                        <StatNumber fontSize="lg" color={textColor}>
                                            {totalInvestments} $
                                        </StatNumber>
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <WalletIcon h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat>
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Total Revenue Distributed
                                    </StatLabel>
                                    <Flex>
                                        <StatNumber fontSize="lg" color={textColor}>
                                            {totalRewardsPaid} $
                                        </StatNumber>
                                    </Flex>
                                </Stat>
                                <Spacer/>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <FiDollarSign h={"48px"} w={"48px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Monthly Revenue <br/>/ 100 Shares
                                    </StatLabel>
                                    <Flex>
                                        <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                            {totalShareCount === 0 ? 0 : (nodesOwned * 0.1 * strongPrice / totalShareCount * 100 * 30).toFixed(4)} $
                                        </StatNumber>
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <FiDollarSign h={"48px"} w={"48px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                </SimpleGrid>
                <Grid
                    templateColumns={{md: "1fr", lg: "1.8fr 1.2fr"}}
                    templateRows={{md: "1fr auto", lg: "1fr"}}
                    my="26px"
                    gap="24px"
                >
                    <Card minHeight="290.5px" p="1.2rem">
                        <CardBody w="100%">
                            <Flex flexDirection={{sm: "column", lg: "row"}} w="100%">
                                <Flex
                                    flexDirection="column"
                                    h="100%"
                                    lineHeight="1.6"
                                    width={{lg: "45%"}}
                                >
                                    <Text fontSize="sm" color="gray.400" fontWeight="bold">
                                        Connected
                                        Wallet: {currentAccount == null ? "Please Connect Wallet" : currentAccount}
                                    </Text>
                                    <Text
                                        fontSize="lg"
                                        color={textColor}
                                        fontWeight="bold"
                                        pb=".5rem"
                                    >
                                        Shares Owned: {userShares}
                                    </Text>
                                    <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                        You can buy EasyBlock shares with USDC and start earning rewards from
                                        StrongBlock nodes.
                                    </Text>
                                    <Spacer/>
                                    <Flex align="center">
                                        <Button
                                            p="0px"
                                            variant="no-hover"
                                            bg="transparent"
                                            my={{sm: "1.5rem", lg: "0px"}}
                                            onClick={() => window.open("https://spookyswap.finance/swap?outputCurrency=0x04068da6c83afcfa0e13ba15a6696662335d5b75", '_blank')}
                                        >
                                            <Text
                                                fontSize="sm"
                                                color={textColor}
                                                fontWeight="bold"
                                                cursor="pointer"
                                                transition="all .5s ease"
                                                my={{sm: "1.5rem", lg: "0px"}}
                                                _hover={{me: "4px"}}
                                            >
                                                Get USDC on SpookySwap
                                            </Text>
                                            <Icon
                                                as={BsArrowRight}
                                                w="20px"
                                                h="20px"
                                                fontSize="2xl"
                                                transition="all .5s ease"
                                                mx=".3rem"
                                                cursor="pointer"
                                                pt="4px"
                                                _hover={{transform: "translateX(20%)"}}
                                            />
                                        </Button>
                                    </Flex>
                                </Flex>
                                <Spacer/>
                                <Flex
                                    bg="#FFFFFF"
                                    align="center"
                                    justify="center"
                                    borderRadius="15px"
                                    flexDirection={"column"}
                                    padding={4}
                                >
                                    <Image
                                        src={'/coins/UsdcLogo.png'}
                                        alt="chakra image"
                                        width={100}
                                    />
                                    <Text style={{
                                        marginBottom: 16,
                                        fontWeight: "bold",
                                        fontSize: 24,
                                        color: "#3e68a4",
                                        marginTop: 8
                                    }}>Pending Rewards: <span
                                        style={{fontWeight: 'normal'}}>{userPendingRewards.toFixed(4)} $</span></Text>
                                    <Button
                                        bg={"#3e68a4"}
                                        p="0px"
                                        variant="no-hover"
                                        my={{sm: "1.5rem", lg: "0px"}}
                                        onClick={() => {
                                            claimRewards();
                                        }}
                                        paddingLeft={8}
                                        paddingRight={8}
                                    >
                                        {!isClaiming ?
                                            <Text
                                                fontSize="sm"
                                                color={textColor}
                                                fontWeight="bold"
                                                cursor="pointer"
                                                transition="all .5s ease"
                                                my={{sm: "1.5rem", lg: "0px"}}
                                            >
                                                Claim Rewards
                                            </Text> : <Spinner/>}
                                    </Button>
                                </Flex>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card maxHeight="290.5px" p="1rem">
                        <CardBody
                            p="0px"
                            bgPosition="center"
                            bgRepeat="no-repeat"
                            w="100%"
                            h={{sm: "200px", lg: "100%"}}
                            bgSize="cover"
                            position="relative"
                            borderRadius="15px"
                        >
                            <Box
                                bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)"
                                w="100%"
                                position="absolute"
                                h="inherit"
                                borderRadius="inherit"
                                ref={overlayRef}
                            ></Box>
                            <Portal containerRef={overlayRef}>
                                <Flex
                                    flexDirection="column"
                                    color="white"
                                    p="1.5rem 1.2rem 0.3rem 1.2rem"
                                    lineHeight="1.6"
                                >
                                    <Text fontSize="24" fontWeight="bold" pb=".3rem" marginBottom={4}>
                                        Buy EasyBlock Shares
                                    </Text>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        marginBottom: 64
                                    }}>
                                        <Text fontSize="24" fontWeight="bold" marginRight={8}>
                                            Share Count:
                                        </Text>
                                        <InputGroup
                                            bg={inputBg}
                                            borderRadius="15px"
                                            w="100px"
                                        >
                                            <Input
                                                fontSize="16"
                                                py="11px"
                                                placeholder="1"
                                                borderRadius="inherit"
                                                value={sharesToBeBought}
                                                onChange={(e) => {
                                                    setSharesToBeBought(e.target.value);
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value === "" || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 1) {
                                                        setSharesToBeBought(1);
                                                    }
                                                }}
                                                textAlign={"center"}
                                            />
                                        </InputGroup>
                                        <Text style={{
                                            fontSize: 24,
                                            marginLeft: 32
                                        }}><span
                                            style={{fontWeight: 'bold'}}>Total:</span> {(isNaN(parseInt(sharesToBeBought)) || parseInt(sharesToBeBought) < 1) ? sharePrice : sharePrice * sharesToBeBought}
                                        </Text>
                                        <Image
                                            src={'/coins/UsdcLogo.png'}
                                            alt="chakra image"
                                            width={8}
                                            style={{marginLeft: 8}}
                                        />
                                    </div>
                                    <Button
                                        bg={"#FFFFFF"}
                                        p="0px"
                                        variant="no-hover"
                                        my={{sm: "1.5rem", lg: "0px"}}
                                        onClick={() => {
                                            buyShares(sharesToBeBought);
                                        }}
                                        paddingLeft={8}
                                        paddingRight={8}
                                        paddingTop={6}
                                        paddingBottom={6}
                                    >
                                        {!isBuying ?
                                            <Text
                                                fontSize="32"
                                                color={"#3e68a4"}
                                                fontWeight="bold"
                                                cursor="pointer"
                                                transition="all .5s ease"
                                                my={{sm: "1.5rem", lg: "0px"}}
                                            >
                                                Buy Shares
                                            </Text> : <Spinner color={"#3e68a4"}/>}
                                    </Button>

                                </Flex>
                            </Portal>
                        </CardBody>
                    </Card>
                </Grid>
            </Flex>
        </div>
    );
}
