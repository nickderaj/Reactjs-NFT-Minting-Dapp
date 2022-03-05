import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import store from "./redux/store";
import Header from "./Header";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const whitelistedAddresses = [
  "0xF75A7ac43E818C7aABF0b4669970902C63042110",
  "0xfB2de21A11a5a648B9C55F7199F402E026AEe19d",
  "0x2b94C14422a0e84EE75dE2F255d1478703d15797",
  "0xacbBA087a2D094F7384DEBFe285574477372265C",
  "0x352bd13a8Dfdf0e9f34C388D36a8F1C67514a255",
  "0xc9cF947873761b0f275Ae2D65479587B00c31676",
  "0xB084aB751D2511AA2076Ea42253949325084a3d7",
  "0x87d1E9cE93c3E4Fc6948F4870EAf2B1C31bFEb0b",
  "0x08ea6A8e56727037F839C8025b1961ca05b93481",
  "0x4bF95145b60450BC1B21b30542676A3423084fC2",
  "0x25a689848825C46C76157E63C3cAc98C3c8e8F76",
  "0x3131ABaee71Ba9E0117C2F4453607D90aD362949",
  "0xB058bc915D2461d884B9C035Da9D17330f42BEAF",
  "0x4c420F90AB06196faa4F56B4ab0EF22C97c32Fec",
  "0x9Bd4b05B6F3cD3778012f72C16c42Fd0490CfB3e",
  "0xF87c6aF470E3B67586316B54ef06830270D43Bd4",
  "0xd84Cb201630aDE0083624FD797E736c79E2F07cF",
  "0x3A391855F1eE1F809f9D2CcBbfa756BeC377B868",
  "0x6538333150ad90A9378e320aBd0c07e3E5553b07",
  "0xFdB968673Da57A2A5f8Ac05dAbfd66E965170Ee5",
  "0x4653a3BBC69840c9bdFAc934a8acC48F8ebb92b0",
  "0x43B38c8B3C182E377eE5AA996A34cAC006D510b1",
  "0xaE9bCA0728BAA3532A5c05C0c9c87F1F2319f2A7",
  "0x36F37c72C754d2FB404c05c4c68092F73a6eDA83",
  "0x2FaD2684123b1425EF35f780bEAa4A99bF01cF86",
  "0x629149B974987Fac5DcDA210DDb6Cc60A0aC7E1b",
  "0x97Ebb3bDDEe93502601D252e5550663E4542bc89",
  "0xAAAFff118E401950C03363aAb1A148E12F7ee301",
  "0x1A7B37c41e1BE0bd23c701fd6dBb179466c7c4C2",
  "0xf0477C81d749b6bD4B38108e04b4d80f000cac7B",
  "0xe9aE4bb555CbD899054122956C9aF6388Fd1E13F",
  "0xF30D0bef7dEcE028A98E7a1289f17546190d3104",
  "0x453674958DcdEb016C73b1cAd7182BF291A9073A",
  "0x093C3AC61178C0c44f230065186A26abA972a6af",
  "0xe262A1c165aeE094e57278C12E671441Ef732124",
  "0x8faA37141F78699c41D9457853cb632d8F2b7321",
  "0x863e671481603a628fCCA2bE519e50189833C112",
  "0x1e0408B598d036360492e48d71a1136693012C98",
  "0xD9E077E066125d7C97d57241b4671bBe36c7a861",
  "0x9708AD2FaF4e1F81d68d9801332282cbf0778704",
  "0x32a0BbAb668Cb1203E7990BD2fc4211337d49478",
  "0xD95Ca3bab3b2f9B3A0Fb9c065546f7BC4bD5DE0B",
  "0xb8D560EE52652Bc74eee36319396Ad1d578886DA",
  "0x835d3cda10EeAd2050EF4da0f418FeDd364bC657",
  "0xd5ec0184ada052277E27AFa33396EFe99845F79a",
  "0xA8Ae335CeC165cE5355494971bC15E6570Cba343",
  "0x61f26E655b11941DADDA59C107c4cAB415F696cF",
  "0xe510bd75b21a79b92c3944840d2a083cba2fdc2c",
  "0x4e302e50fa0D761A64Eb850d39a75A8575DB50bE",
  "0x124a6A603B2C89675E279a1D81c3FA7444a9C320",
  "0xDD67AfF458fF20222d32cCA3ea75D10F08Cdc39E",
  "0x78a13Ca3de4821AD01e029f3ED89bBaCEDc6d440",
  "0xC7D6C2DaD24A1549FC6B20f107184dcC7D78bBb1",
  "0xd8fcaCBc0A3D6a8eecBa3B0329C0b958F83132E6",
  "0x5822feF68499A3d396594D4BaB2786f43b40e7EE",
  "0x4279896D94c60694138180471Ccc6b5a408418cf",
  "0x08D1C90A8D2d6aD0e7c8D012187EBeDF88E51d25",
  "0x0d07cc82Df7d949742DE4C1F66FBc0Caa081693A",
  "0x8151dfbd567d818b81170d81aaf2c566a01e1cb2",
  "0x512c972301F93A2B05e045B45483734E029150be",
  "0x5eAB685a66dB107bC228dA7eB09bB82d84CE8C97",
  "0x9Fd9941FF57b5dE8ad94896947CfD41998d80eb7",
  "0x78addc26163d430025Ec83db97Fcb2feef581546",
  "0x6050529831605e2e8Ae46e32B919dD13bd939F70",
  "0x64Cd629E020Dc1131Bd18B7a80C0656341D89038",
  "0xB60b1605208e027a666e62EC39404e58d5Be4aae",
  "0x3ba2F91F3f6299359DedFa508E0E910Fb68C8da6",
  "0x81f39512D512baA19b4d1D06d22D62A6c7980B9B",
  "0xa843e810A98C5Dca13aB117956aa50AB30474cF1",
  "0x5711Ffa640821DF1b70d1dCf644C8B4AE64A5c5d",
  "0x2fa2862221260616fb77049d395EF273ee30Fc42",
  "0xc188d98db92e3c9782bf5a887d7cb36c854c2dcf",
  "0x3d72A400caBe8303142D7351cF2C7776ba1c44ae",
  "0xC95940616FB77F520De9c40ab664339B3dACd531",
  "0x7dd6FE450C8314ab070d727AD9534d633Cdd3F20",
  "0x164ecb7f67fA080231bBc1CFF14D84bda649ef1a",
  "0x49303Ffe383EBAB6CaFD2175E2EfcdB753BA6eCf",
  "0xf7108cC1D04ae75230843dB1a0b9c76C2EEFd9Ed",
  "0x12F3Ab830cdd9Db348A06a8eDa0619A9c2EC10b8",
  "0x8F595f25C58EE2a5bdD047E91D3ac0250bbaAfCD",
  "0xc88D29Bff77C101045f0344a338FA6a3A11EF459",
  "0x0Eb375788094357d6943B2AFa88E7C164b0Ea26C",
  "0xB35475e60158b64954c615DBA5e43893e3F0Cb0B",
  "0x940c0f4c77bB4b89e09ed7e12E6902D9b05C674f",
  "6G2BviBuKPD27sTW9Z7mAjNvrZjuKTY6Coqyw1Txio3",
  "0xA4867A4Ee98654D764755d00B0d386D1189182b0",
  "0x1061D71557dec73bF8F65dF86f161b4e00f35E60",
  "0xcCfCcEf769A9D92Da3eE9d01ea2a8AC8585236C6",
  "0xcE73f5b5751441ACEe8D28cf294Db1c308cF1D74",
  "0x208c282Aee3101e17e27E3828D1844061d4480E7",
  "0x7628AD148D07D471F991B9ddd6b2b698252A5845",
  "0x1e25872176B2cfad8C20389FCbAD178c6b9d7971",
  "0x2208746Cb313ea46E9B44866e42B725F99b66D4d",
  "0x8F66c0c359B4546512BC8dca379B89Ac93008d97",
  "0x1A1E32FE108a96C17c2A83BD9865da0303abf1e5",
  "0xe3De91848A66bfb124af5D726Ae37e0ADc2956b4",
  "0x5B3c162c8b1345b16eaF175A92C9ecfe6072B450",
  "0x4181482954a709B4295E16c8B1802CE9d0a42637",
  "0x661d3005506AEA3DEf4422606b1A31be9cef1d80",
  "0xe2099D6962ED54B837254221A8aA40e9A1A30Bfd",
  "0xf00C1BeE8e1a73f5bFdce1a43a0D2fc279D4e541",
  "0x31A6A3E072aa5BDaF17F92b26C806b18D463EB8e",
  "0xa400E4B45e5aaf09CCd220199cc6E76B2F5DAE0E",
  "0xDdf5Afb04abB610D35D49531C79D532084f71489",
  "0xaB4c1D180AD252d0Af8453A2Fbd0b64e03b85F42",
  "0xcd71315c21bab6eCe689c387fFB074696f2ec5a7",
  "0x6929376020d0b3eeF517f176B1C81596D08Abe50",
  "0x855774e66edD67947227A9f4C146a44df4f8C4B2",
  "0xa9d51E692177Bc3bb76C88e7a50A1c0fF2038086",
  "0x00679B383E98e2Ec60b0878A8dbc31760fC7fbe2",
  "0x01042a2C6a39Cf221a2D9Dc82B47EbfAa5DC3E90",
  "0x4a1e08fd3F46B08c564Edcd68171c70925ae5C54",
  "0x3aB1362B47490f81675d70f7b61BD054fA1f884f",
  "0x16BA5CcA1208739EFe3b8Ae35AA23cfdd96A6b18",
  "0x1E8B35D3833a5B411bdA14a55F08E1989666045E",
  "0x809a5757fccA6929c63E7cD010d1feeaED3737C0",
  "0x24d5ACd17a2deF16b451Cc31bB1785F99bF11992",
  "0x08850776A3119648dA718BA114C3aCA816FA8B82",
  "0x08ccF9DB6FFBAad0B7e087FC1807aB17f944cA52",
  "0x69cf21b0BF33Cd668a8Ad2070700EC3bfE48b775",
  "0x386F8AC6941C7dF1da475E68f2862A8AA035AF89",
  "0xD123699585742aB551e8FB1163Cf9FB63a913367",
  "0x25dEab1d86a2008a34D4C883dA36053A34F319cD",
  "0x54e2489034C8dD804762033313955a1e27959306",
  "0xC9e046b08C35f5b15424c95F24E4B050980D2b7C",
  "0x353807698E48f253B0319c10a6CBA7440A7b9744",
  "0x3c8eBdeCe6A1AA947F6eB1F582afDD86D5D819c7",
  "0x8be8f0Ec8547Dd725658bFE1119F730A3802ac8e",
  "0x5d547DA6325c086CD8d767A8d42Ef6f4BF5e43d0",
  "0x1dfB14ab0C0dd14FB1F8D8ca765900CD2D709705",
  "0xa53713E15996Da5e76b6566861160e932D7a2bB9",
  "0x38707281Ca035CFf49b0b3ac403ce737857BD432",
  "0x13060dC523C195a878BcCe8285427924140ab907",
  "0x8048C109580D8dC301d8d99EbBFddC65edb762E5",
  "0x412E67e7a79A195af1f4d976d9651B76ff89D6ec",
  "0x9586E580d54945E8d7Ff90CC8B934570865302e2",
  "0xBB5E4b2ddE991c910BcA023D571FeB82f0Cf34CC",
  "0x57Cd523765f5f9dA6C0FF3131e3527f033768DF4",
  "0x10d8771ef0F34a0c2Ff16FbDD057EFFBb3B5369A",
  "0x9BeD1A60EF129Ff525FA7E520e60BdBf6aAC4b02",
  "0xc2a224BEffCE5f7bA2f0AFB405a16242c4d1De02",
  "0x1E454cfCa1AcA1CC9288270A46430b118Ad1b4Da",
  "0xd94e53dbca026563Eb0E81abee553A7d5455fE2b",
  "0xC9E6c5Ced4dD6F4CEA54BEDB8e98bD4277A3F5E9",
  "0x376188bA653C330318a0B142535cE5eb5a4b8A7E",
  "0x7AF15e540A59246A67D26A0529EB317394eB920D",
  "0x666e16d28E15eF7f828DACBFcdAd2f6e0F97f4D9",
  "0xf934d60da1F027D0b9B6cAA52bDE6583eb171f46",
  "0xCf2f6Eae5F3Ab49BE5f7fbfC2AE6B11055ef3F2B",
  "0xDb3255028073d2a81738F1457FedD7CbE08c6e09",
  "0x2f79D3621719452699e4a15792E1581F0a47d98b",
  "0xcFD43890B33c3718e238Fb6574a9a4F6a703A8e4",
  "0xcD2d1Db890bC8533F10B70268EBD909D7Dd47780",
  "0xD95Ca3bab3b2f9B3A0Fb9c065546f7BC4bD5DE0B",
  "0x7e548bf6d378babACf7Da1483Aaf5f7C9488d64A",
  "0x5BCa1E48B543811674aF1B56a4378B7c498001fB",
  "0x8dA0E4EcbB45700Fb0A88d40c281DE74B655ced6",
  "0x72186C0C1C26b8e053F28f0645f9D474cBe75298",
  "0x928042ecb5976EAa60DF35D34305FBC940f491C7",
  "0x2A8070F313CBe95DaE30A80503c327CA830a15a5",
  "0xB9d92bFE987B9824E78E17Ce7Dd0531E40D87C78",
  "0xf5c09456F5156E5be3bCfB40ED6630921C8EF806",
  "0x35F25FDA5027fCACD5f5fbfda2044A1375Fd2C9E",
  "0x0B4543f6D5A2527AfdA44973C19309588388B561",
  "0x0D2ca24B6F8E26621A4bd31A9E9b92d610B759AA",
  "0x91b2082d0e3bcd43c3e06097bae184eaba2d0d89",
  "0x1EccA084Da586F5e67bf8fc222692503aD2D69f4",
  "0x3a9e5E90B35C13F271b4FC1DBdf3BecF7b37Ec69",
  "0x9D42b9Ae86d47Ee02900c5df8d090D27955FF8E3",
  "0xD6cD25bEC9b184c8F26746200D6288CE8604C23E",
  "0x817f0F493F9654857DEF706280AF2b2FBf2DAaa5",
  "0xb8720e3B6b60ADc179C5B1F2503239BACe2EDdb7",
  "0xb8720e3B6b60ADc179C5B1F2503239BACe2EDdb7",
  "0xd10EF8798e886e50Fb7232D53ccdd734c7970665",
  "0x922419CEAc3DB284BE9926422c97D8c70E2686A6",
  "0x6929376020d0b3eeF517f176B1C81596D08Abe50",
  "0xabA5570e3236Ca886880CD4cbbAd409Da92feFAf",
  "0x0A913347733F818e325537369CCD935206Da722F",
  "0xEA708Bc7E2D8E1EBD19C8aE49da94AC81Edfc2A5",
  "0x17136144999C10439D90A2aC22386595BfEf0527",
  "0xEb22214634bF88c0be490C96795601e9520579a7",
  "0xC1981C8352B60699b9b48D71038F8D07D1372904",
  "0xaDedE978Cc84E08EEFcD8fe50Ce5D7D1FC8d3633",
  "0x9209Aeb0978E190F63b957514A3A8Ab291dc4204",
  "0xb19747A1E27063Cd2872963bc2f2987D82Db75b7",
  "0x34eE6b036A1874CB4bc3Afc0F66182512a621224",
  "0xF3BAc93A71022aad42e104C46be5De642ED91147",
  "0xe5b8E251fa2419E425E04896Fb752103eA97C562",
  "0xE37314e82209b81dE691E75bdf24A9Bfb6f93427",
  "0xe9bf98A071ae5f8fe02406B01e6d1A069d246578",
  "0xF8d28913892516f892298b44f091E7A8A821b2Af",
  "0x469798a68A91bBFe0b429921d656b818cC718516",
  "0x8315301b4916B2582bDCe6D76292c70860DCb2fB",
  "0xB4A7769e66bfa799e6Dbada2dBe0BB1d95fA09F1",
  "0x6DaE6A4D7902E78CeCaAB8aD14E38f6Df8609dc1",
  "0x72de8bFb73dCA35D27c8FF90B095bF30702D8fad",
  "0x7Ae6Ca3C02Eceb37D6E9eaFc1872ec246177173a",
  "0x0F952A6502a6A59650018e484d638f1433aEa8f5",
  "0xE08d24b1f11Be55B222f7A4F57D25694B6D1e495",
  "0x7db41638E02F03E6620f830693f88aDf511c648E",
  "0x03dd942fBD1220C9d76CB91683b49586b71c5a46",
  "0x1053b9ab0c63ee8eCD667Ac4BEcA8eCB4d37c3AA",
  "0x7c3B2e04f2C07b67dF7466071ec6017d86310279",
  "0x0313242f2Fd07E0C0BaFA0Aa2892774c8251c47F",
  "0x9d0095122AEC8D54770C4106939a5681a96B8747",
  "0xE74F57b6658776CfdDBd0301c384b91CEe41db5b",
  "0xe5F6f1f40899a461cCC4D910c8E957f1933717C5",
  "0x038bBA42451025FdB3Ec6c4789CdB6491D242e9D",
  "0xC3503107a4297611a00b88D70510b206da6F99C5",
  "0x562E72D88c27d189931A503E91c4D552b484f257",
  "0x13D761DB77E560043C61bD7549F02c5fC3Cb9FC0",
  "0x58C30489df1182C3D7b7C0A14562Ec51e68f7fa5",
  "0xCBA816FF3CBb1cc925073dA43Eb1F838A037D5B7",
  "0x7F8A5bF89E04aC632D23bEa2b368B5b25253c1fD",
  "0xD69ACB65166A05aEB96055C9A23d2Ac30e72EE9a",
  "0x57c24D4De21ea9EB61e86758d57D5aFaA8E0c685",
  "0x57b6E88577B1930C7BBb4b8de3A1712278205379",
  "0x639c93E5511462aCd49628b4EDC9BEd71b0c8361",
  "0x205C24C8672bfebf18941ddDa5162A30Ad0477a7",
  "0x17a99101cad22B5439eD3b8d4E956cCeD27a3aD2",
  "0x6ECD4aDCfE44E2A4BdEb30b63294DaBA5220B0b1",
  "0xC78bcF31908F0BE36A353960552aE39C1c35C337",
  "0xEc28C9D6095709b99331928B187F566794538F38",
  "0x86299731735d7B257a0Ce5f0bAdF55f0dE3214d1",
  "0x07b89a4c67206c82bd8c1a3944299c1c8f52553e",
  "0x41b1DE767513D31450940911F6C6213aF69D219b",
  "0x89CE794D2B4079D202C9de6a62c71C11193BE9b5",
  "0x5C546e9c0456A5E8e2147bABb974b6e02Ecb9d18",
  "0x6bFB134E343275b6C45798B2746a91c9f447e2dc",
  "0xA478e90B3Ed81c63E1963Ce9ffCa3c2B5b41a28c",
  "Xygoh.eth",
  "0xD77C5a4dde6199fb86FeE68F8AbF21fc6e5B72D1",
  "0x79DeF81E7B284489F0abde3140E85D7373e5E7B4",
  "0x08103E240B6bE73e29319d9B9DBe9268e32a0b02",
  "0x6f672035B98672A05F2a43543C44539c09AbB272",
  "0x586AB5Fc39a2bf7c230b816298FAaF6f6519dD2C",
  "0xFA83a81080Ba4A7fca569f4D55D1640d9A0bb597",
  "0x989c8DE75AC4e3E72044436b018090c97635A7fa",
  "0x20a6f9da697523a6f6123ea4240992157cc9c4d4",
  "0x98A3b4eA1E81ef7C4075EA419EA671bd2B2AD858",
  "0xC07f82245d52590959398007bB7848e0832F2Dde",
  "0xe5F569C93eb7E8306A6c21223b99ecde76Be8B8d",
  "0xDe98694F7adF3dAcA2c9a9c2B10C071220bced71",
  "0x4b7D4D5bC4A13722DaAf9ddb803F1F7474Bb67aA",
  "0xed01D36c1e315bb44b83d28bd78e78fFAE907ecf",
  "0x491E85b2d292cDD66477E8c70349eF2AC50a4Aa4",
  "0xf57E70E6d1382092d0Ea3a2a6Ef5c03e112d6849",
  "0x345E9f9b55E6Ea19887c97A0Fcfafab73102816F",
  "0x3f8Ba3d0df3245Dc63201cCBdB1E5784F3AE2A7b",
  "0x519fa46AE91630BeaF77c2e2FeB8A2626E82daC5",
  "0x9441e690788B01b660E8d00Eb09f007fe8C84B71",
  "0x708D81269F9C93235f6996826712D62C2f6C3dE8",
  "0x95A5C86621Bd135bCE76ecbc2D37d1ca195c8D7f",
  "0xC78e8c824046d2a3aC97c012FAFd31d4207a74A3",
  "0x6c9AEa677b8e44Ea274B291Bf3B87451cD7b9466",
  "0x283B9648C82432AfacA1fa8E52fB62305461AA3F",
  "0xEf42E656cBda027149A6051ff64E815f22bcE470",
  "0x088D6be77972bC3501e82765030983a86F1B5C07",
  "0x341D13B93a9e6eC3B9b2B5C3EE7747D6eC95Cf69",
  "0x8Edab863c5C7EcCa66Aa6D09b1f1DC81F1875fb0",
  "0x5a49894aD4aA8c1ce3842280Ff0B7dC29097F684",
  "0x5711Ffa640821DF1b70d1dCf644C8B4AE64A5c5d",
  "0xC69ABf802332f9De3e5352f459697FD6D15d5415",
  "0xEcb28503b9F887Dfc37Ec7d650685154DC830388",
  "0x8346BCbF229E1E45d8e7742b57940e62b39c90F1",
  "0xF75A7ac43E818C7aABF0b4669970902C63042110",
  "0x33686541F23E1d137374Da93af3055Ad6F52C642",
  "0x484ADef8f940C01B79F8603685CCaEF84c259B01",
  "0x31c55f64cDd0dcEB6A3ce2174044ad9350E2c337",
  "0x2734EAE33eF5295F3e6754b64D0e5a8e80711979",
  "0x27Bf3b5CFa8f414C89ac2345D3c5e66D86F40C9F",
  "0xf00C1BeE8e1a73f5bFdce1a43a0D2fc279D4e541",
  "0xf0477C81d749b6bD4B38108e04b4d80f000cac7B",
  "0xfc04aDd6E6DB7492B9c690322b7AF27f233314ED",
  "0x6C1a1d948af821820a8725FDD8D379484413A435",
  "0x6419708060661D48F987dBd871c57697474cB199",
  "0xe72c52Ce4212FcfB2Ce5682F8910a03Bf02d8ff2",
  "0xecb3b7bf5b8d5786cb069ed33f342ef357729f49",
  "0xf6711fe5aE249B9CF37956a7A801885D171d3c93",
  "0xA3E590B28f948473C6D53314E865c4000Fef01f4",
  "0xA4D12950Ed4494e4dF86e2ef319Cf99370451d92",
  "0xb737bF8ded5D847e0dd0025E3076772EF250eEC3",
  "0x053EE663950ef883fc774aD77B14C5c8ea43ce38",
  "0xdae6fC7Ee0DBE50A5f6822E79b8B2E2e237B21A2",
  "0xA51e87a0329647aB35078592106Da34A68840B79",
  "0xc86D233CdF4B7F93494538cf27aB1b6B2325b40E",
  "0x97A9672b5f9B746e70C7BcD33334B2f1D19F2EC1",
  "0x6981be4c3d214df252d92792a7AedeF35717e6D0",
  "0x29B267e49546C6BA064E7104582a827F663f5391",
];

const lowerCaseWhitelist = whitelistedAddresses.map((el) => el.toLowerCase());
const whitelistedFull = [...whitelistedAddresses, ...lowerCaseWhitelist];

export const StyledButton = styled.button`
  align-self: center;
  font-family: "Patrick Hand SC", cursive;
  background-color: #f7f8fa;
  background-image: none;
  background-position: 0 90%;
  background-repeat: repeat no-repeat;
  background-size: 4px 3px;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(245, 220, 255, 1) 4px 4px 1px 1px;
  box-sizing: border-box;
  color: #010606;
  border-color: #010606;
  cursor: pointer;
  display: inline-block;
  font-size: 2rem;
  line-height: 23px;
  outline: none;
  padding: 0.75rem;
  text-decoration: none;
  transition: all 235ms ease-in-out;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  :hover {
    transform: translate3d(0, -2px, 0);
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #f7f8fa;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: black;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  color: #010606;
  border-color: #010606;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  box-shadow: rgba(245, 220, 255, 1) 4px 4px 1px 1px;
  -webkit-box-shadow: rgba(245, 220, 255, 1) 4px 4px 1px 1px;
  -moz-box-shadow: rgba(245, 220, 255, 1) 4px 4px 1px 1px;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  /* @media (max-width: 766px) {
    flex-direction: column; */
    /* flex-direction: column-reverse; */
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
  background-color: #66bcd7;
  height: auto;
  margin: 0 auto;
  max-width: 30rem;
  border-radius: 50%;
  box-shadow: 0 0 1rem 0.2rem black;
  /* transition: width 0.5s; */
`;

export const StyledCont = styled.div`
  /* width: 60%; */
  /* border: 2px solid black; */
  padding: 0 10rem 2rem 10rem;
  display: flex;
  justify-content: center;
  grid-gap: 3rem;
  flex-direction: row;
  align-items: center;
  @media (max-width: 766px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const StyledLink = styled.a`
  color: black;
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click MINT to mint your NFT.`);
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
    let allowedtomint = true;
    let paused = await store
      .getState()
      .blockchain.smartContract.methods.paused()
      .call();
    let wlActive = await store
      .getState()
      .blockchain.smartContract.methods.whitelistMintEnabled()
      .call();
    if (wlActive) {
      allowedtomint = whitelistedFull.includes(blockchain.account);
    }
    if (paused) {
      setFeedback("The sale is not open yet.");
    } else {
      if (wlActive && !allowedtomint) {
        setFeedback("Sorry, you are not whitelisted. Wait until public sale.");
      } else {
        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
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
            setFeedback(`You've adopted a Ghost Cat! Thank you so much!`);
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
    if (newMintAmount > 3) {
      newMintAmount = 3;
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
        Accept: "application/json",
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
    <>
      <Header />
      <div style={{ paddingBottom: "2.8rem", backgroundColor: "#f7f8fa" }} />
      <s.Screen>
        <s.Container
          flex={1}
          ai={"center"}
          style={{ padding: "24px 0 0 0" }}
          image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.jpeg" : null}
        >
          <h1
            style={{
              color: "#010606",
              margin: "0",
              textAlign: "center",
              fontSize: "5rem",
              textShadow: "0.4rem 0.4rem #f5dcff",
              lineHeight: "5rem",
              fontFamily: "Patrick Hand SC,cursive",
              fontWeight: "700",
            }}
          >
            The Friendly Neighbourhood Ghost Cat
          </h1>
          <s.SpacerSmall />
          <ResponsiveWrapper flex={1} style={{ padding: "24px 0" }}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg alt={"Ghost Cats"} src={"/config/images/mint.gif"} />
            </s.Container>
            <s.SpacerLarge />
            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                padding: "2.4rem 2.4rem 0 2.4rem",
                borderRadius: 24,
              }}
            >
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {CONFIG.TITLE_ONE}
              </s.TextTitle>
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {CONFIG.TITLE_TWO}
              </s.TextTitle>
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "25",
                  color: "#66bcd7",
                }}
              >
                {CONFIG.MAX_PER_WALLET}
              </s.TextTitle>
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 50,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {data.totalSupply !== 0
                  ? `${data.totalSupply} / ${CONFIG.MAX_SUPPLY}`
                  : `? / ${CONFIG.MAX_SUPPLY}`}
              </s.TextTitle>
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle style={{ textAlign: "center", color: "black" }}>
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription
                    style={{ textAlign: "center", color: "black" }}
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
                  <s.TextTitle style={{ textAlign: "center", color: "black" }}>
                    1 Ghost Cat costs {CONFIG.DISPLAY_COST} ETH
                  </s.TextTitle>
                  <s.TextDescription
                    style={{ textAlign: "center", color: "black" }}
                  >
                    (Excluding gas fees)
                  </s.TextDescription>
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "black",
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
                              color: "black",
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
                          color: "black",
                          paddingTop: 25,
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
                          color: "black",
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
                            color: "black",
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
                          {claimingNft ? "MINTING" : "MINT"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
              <s.SpacerMedium />
            </s.Container>
          </ResponsiveWrapper>

          <StyledCont>
            {CONFIG.OPENSEA != "" ? (
              <StyledButton
                onClick={(e) => {
                  e.preventDefault();
                  window.open(CONFIG.OPENSEA, "_blank");
                }}
                style={{
                  width: 120,
                  boxShadow: "#bcf0fb 4px 4px 1px 1px",
                }}
              >
                OPENSEA
              </StyledButton>
            ) : null}
            {CONFIG.SCAN_LINK != "" ? (
              <StyledButton
                onClick={(e) => {
                  e.preventDefault();
                  window.open(CONFIG.SCAN_LINK, "_blank");
                }}
                style={{
                  width: 120,
                  boxShadow: "#bcf0fb 4px 4px 1px 1px",
                }}
              >
                CONTRACT
              </StyledButton>
            ) : null}
          </StyledCont>
          <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "black",
                paddingBottom: "4rem",
              }}
            >
              Please make sure you are connected to the right network (
              {CONFIG.NETWORK.NAME} Mainnet) and the correct address. <br />
              Please note: Once you make the purchase, you cannot undo this
              action.
            </s.TextDescription>
          </s.Container>
        </s.Container>
      </s.Screen>
    </>
  );
}

export default App;
