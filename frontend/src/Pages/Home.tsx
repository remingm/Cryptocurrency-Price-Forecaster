import CoinDisplayComponent from "./Coin/CoinDisplayComponent";
const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
const yyyy = today.getFullYear();

const date = mm + "/" + dd + "/" + yyyy;

const Home = () => {
  return (
    <div>
      <div className="max-w-2xl mx-auto text-center pt-24 px-4  lg:px-8">
        <h2 className="text-3xl font-extrabold  sm:text-4xl">
          <span className="block">AI-Powered Crypto Forecasts</span>
        </h2>
        <p className="mt-4 text-lg leading-6 mb-10">
          Live BTC price predictions for {date}
        </p>
        {/* action button hidden below */}
        {false && (
          <a
            href="#"
            className="mt-6 mb-10 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 sm:w-auto"
          >
            Sign up for free
          </a>
        )}
      </div>
      <CoinDisplayComponent coinId="BTC"></CoinDisplayComponent>
    </div>
  );
};
export default Home;
