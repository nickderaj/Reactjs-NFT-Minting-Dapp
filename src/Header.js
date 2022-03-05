import "./styles/Header.css";
import twitter from "./social/twitter.svg";
import insta from "./social/insta.svg";
import discord from "./social/discord.svg";
import opensea from "./social/opensea.svg";
import home from "./social/home.svg";
import ButtonExt from "./ButtonExt";

const Header = () => {
  return (
    <div className="header-wrapper">
      <div className="header-items">
        <div className="header--logo">
          <ButtonExt
            location="https://ghostcat.xyz"
            image={home}
            alt={"Home"}
          />
        </div>
        <div className="header--nav">
          <div className="header--nav-items">
            <ButtonExt
              location="https://twitter.com/GhostCatNFT"
              image={twitter}
              alt={"Twitter"}
            />
          </div>
          <div className="header--nav-items">
            <ButtonExt
              location="https://discord.gg/BtvMy8AjU7"
              image={discord}
              alt={"Discord"}
            />
          </div>
          <div className="header--nav-items">
            <ButtonExt
              location="https://www.instagram.com/ghostcatnft/"
              image={insta}
              alt={"Instagram"}
            />
          </div>
          <div className="header--nav-items">
            <ButtonExt
              location="https://opensea.io/collection/ghostcat-nft"
              image={opensea}
              alt={"Opensea"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
