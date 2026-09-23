import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0">
      <div className="text-grey text-xs px-6 pt-3 pb-10">
        <p className="pb-1">
          All data obtained from LTA's{" "}
          <span>
            <Link className="underline" href="https://datamall.lta.gov.sg">
              DataMall API
            </Link>
          </span>
        </p>

        <p>
          Built by{" "}
          <Link className="underline" href="https://github.com/jadenlohh">
            jadenlohh
          </Link>
        </p>
      </div>
    </footer>
  );
}
