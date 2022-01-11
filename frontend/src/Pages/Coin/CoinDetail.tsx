import { useParams } from "react-router";
import CoinDisplayComponent from "./CoinDisplayComponent";

const CoinDetail = (props: string) => {
  const { coinId } = useParams<{ coinId: string }>();

  return (
    <div className="pt-28">
      <CoinDisplayComponent coinId={coinId}></CoinDisplayComponent>
    </div>
  );
};

export default CoinDetail;
