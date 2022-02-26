import "./styles/Button.css";

const ButtonExt = ({ location, text, image, alt }) => {
  return (
    <a className="button" href={location} target="_blank" rel="noreferrer">
      {text}
      {image && <img className="button--img" src={image} alt={alt} />}
    </a>
  );
};

export default ButtonExt;
