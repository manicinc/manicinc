// import logoBrightPath from "../images/clients/bright-path/logo-light.svg";
// import logoFamilyFund from "../images/clients/family-fund/logo-light.svg";
// import logoGreenLife from "../images/clients/green-life/logo-light.svg";
// import logoHomeWork from "../images/clients/home-work/logo-light.svg";
// import logoMailSmirk from "../images/clients/mail-smirk/logo-light.svg";
// import logoNorthAdventures from "../images/clients/north-adventures/logo-light.svg";
// import logoUnseal from "../images/clients/unseal/logo-light.svg";
import Container from './Container';

const clients = [
  ['Edelman', ''],
  ['Hereafterlegacy.ai', ''],
  ['The Specter', ''],
  ['Grapple Media', ''],
  ['NuBloom NFTs', ''],
  ['Smurf Finance', ''],
  // ["", ""],
  // ["Bright Path", ""],
  // ["North Adventures", ""],
];

const Clients: React.FC = () => {
  return (
    <div className="mt-24 rounded-4xl bg-slate-800 py-2 sm:mt-32 sm:py-32 lg:mt-56">
      <Container>
        {/* <div className="flex items-center gap-x-8"> */}
        <div className="max-w-3xl py-4">
          <h2 className="font-display text-3xl font-medium text-white [text-wrap:balance] sm:text-4xl">
            Our clients
          </h2>
          {/* <h2 className="text-center font-display text-sm font-normal text-white sm:text-left">
            We have worked with hundreds of amazing people across all industries
          </h2> */}
          <p className="mt-4 text-gray-400">
            We have built with hundreds of amazing people across all industries
          </p>
          {/* <div className="h-px flex-auto bg-neutral-800" /> */}
        </div>
        {/* <divStagger faster> */}
        <ul
          role="list"
          className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {clients.map(([client, logo]) => (
            // If logo is not ""
            // logo !== "" && (
            <li key={client}>
              {/* <div> */}
              <p className="text-slate-50">{client}</p>
              {/* <Image src={logo} alt={client} unoptimized /> */}
              {/* </div> */}
            </li>
            // )
            // (logo == "" && (
            //   <li key={client}>
            //   <div>
            //     <p>{client}</p>
            //     {/* <Image src={logo} alt={client} unoptimized /> */}
            //   </div>
            // </li>
            // )
            // )
          ))}
        </ul>
        {/* </divStagger> */}
      </Container>
    </div>
  );
};

export default Clients;
