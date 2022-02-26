import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import store from "./redux/store"

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--primary);
  width: 100px;
  cursor: pointer;
  :hover {
    background-color: var(--primary);
    color: var(--secondary);
  }
`;

export const StyledButtonFoot = styled.button`
  padding: 10px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--primary);
  width: 100px;
  cursor: pointer;
  :hover {
    background-color: var(--primary);
    color: var(--secondary);
  }
  @media (max-width: 766px) {
    margin-bottom: 24px;
    max-width: 120px;
    width: 120px;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (max-width: 766px) {
    flex-direction: column;
    flex-direction: column-reverse;
  }
`;

export const StyledLogo = styled.img`
  width: 195px;
  @media (min-width: 767px) {
    width: 195px;
  }
  max-height: 100px;
  transition: width 0.5s;
  transition: height 0.5s;
  cursor: pointer;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  height: auto;
  width: 100vw;
  @media (min-width: 900px) {
    width: 45vw;
  }
  @media (min-width: 1000px) {
    width: 45vw;
  }
  transition: width 0.5s;
`;

export const StyledCont = styled.div`
  width: 90%;
  border: 2px solid var(--primary-text);
  padding: 24px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  @media (max-width: 766px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = async () => {
    let allowedtomint=true
    let paused = await store
    .getState()
    .blockchain.smartContract.methods.paused()
    .call();
    let wlActive = await store
    .getState()
    .blockchain.smartContract.methods.whitelistMintEnabled()
    .call();
    if (wlActive) {
      allowedtomint = await store
      .getState()
      .blockchain.smartContract.methods.whitelistClaimed(blockchain.account)
      .call();
    }
    if (paused) {
      setFeedback("The sale is paused now.");
    } else {
      if (!allowedtomint) {
        setFeedback("Sorry, you are not whitelisted. wait until public sale.");
      } else {
        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
          .mint(mintAmount)
          // .totalSupply()
          .send({
            gasLimit: String(totalGasLimit),
            to: CONFIG.CONTRACT_ADDRESS,
            from: blockchain.account,
            value: totalCostWei,
          })
          .once("error", (err) => {
            console.log(err);
            setFeedback("Sorry, something went wrong please try again later.");
            setClaimingNft(false);
          })
          .then((receipt) => {
            console.log(receipt);
            setFeedback(
              `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
            );
            setClaimingNft(false);
          });
      }
    }
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 30) {
      newMintAmount = 30;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: "24px 0" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.jpeg" : null}
      >
        <p style={{color: '#010606', margin: 0, textAlign: 'center', fontSize: '5rem', textShadow: '0.4rem 0.4rem #f5dcff', lineHeight: '5rem'}}>The Friendly Neighbourhood Ghost Cat</p>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: "24px 0" }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/examples.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              padding: 24,
              borderRadius: 24,
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {CONFIG.TITLE_ONE}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {CONFIG.TITLE_TWO}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: "25",
                color: "var(--accent)",
              }}
            >
              {CONFIG.MAX_PER_WALLET}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST} ETH.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect your Metamask wallet
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "var(--accent-text)",
                        paddingTop: 25
                      }}
                    >
                      {CONFIG.SOLD_OUT}
                    </s.TextTitle>
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <StyledCont>
          {CONFIG.TWITTER != "" ? (
            <StyledButtonFoot
              onClick={(e) => {
                e.preventDefault();
                window.open(CONFIG.TWITTER, "_blank");
              }}
            >
              TWITTER
            </StyledButtonFoot>
          ):null}
          {CONFIG.INSTAGRAM != "" ? (
            <StyledButtonFoot
              onClick={(e) => {
                e.preventDefault();
                window.open(CONFIG.INSTAGRAM, "_blank");
              }}
            >
              INSTAGRAM
            </StyledButtonFoot>
          ):null}
          {CONFIG.DISCORD != "" ? (
            <StyledButtonFoot
              onClick={(e) => {
                e.preventDefault();
                window.open(CONFIG.DISCORD, "_blank");
              }}
            >
              DISCORD
            </StyledButtonFoot>
          ):null}
          {CONFIG.ROADMAP != "" ? (
            <StyledButtonFoot
              onClick={(e) => {
                e.preventDefault();
                window.open(CONFIG.ROADMAP, "_blank");
              }}
            >
              ROADMAP
            </StyledButtonFoot>
          ):null}
          {CONFIG.OPENSEA != "" ? (
            <StyledButtonFoot
              onClick={(e) => {
                e.preventDefault();
                window.open(CONFIG.OPENSEA, "_blank");
              }}
            >
              OPENSEA
            </StyledButtonFoot>
          ):null}
          {CONFIG.SCAN_LINK != "" ? (
            <StyledButtonFoot
              onClick={(e) => {
                e.preventDefault();
                window.open(CONFIG.SCAN_LINK, "_blank");
              }} 
              style={{
                width: 170
              }}
            >
              VERIFY CONTRACT
            </StyledButtonFoot>
          ):null}
        </StyledCont>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
