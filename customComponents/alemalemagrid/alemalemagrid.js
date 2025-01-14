import "./hifzGrid.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import Image from "next/image";

import { selectDataTwo } from "@/apiservices/widgetapiservices";

function fisherYatesShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getData() {
  const res = await selectDataTwo({
    activeStatus: "active",
    widgetName: "alem_alema_testimonial",
  });

  if (res.status === "Alhamdulillah") {
    const dataObject = {
      hifz_result: null,
    };

    dataObject.hifz_result = res.data;

    // Shuffle the hifz_result array in-place
    fisherYatesShuffle(dataObject.hifz_result[0].widgetPayload);

    return dataObject;
  } else {
    mytoast.danger("Data fetching error. Try Refreshing the page");
  }
}

async function AlemAlemaGrid({ number }) {
  const data = await getData();

  return (
    <div style={{ backgroundColor: "#EAEAEA" }}>
      <h2 className="style-14h1">
        Who Become Alema/Alema from Internet Madrasa
      </h2>
      <div className="alemalemagrid">
        {data.hifz_result[0].widgetPayload.slice(0, number).map((item, i) => (
          <div key={i} className="style-6">
            <div className="style-7">
              <div className="style-8">
                <Image
                  width={110}
                  height={110}
                  src={item.image}
                  alt="Photo"
                  className="style-9"
                />
              </div>
              <div className="style-10">
                <p className="style-11">{item.designation.bn}</p>
                <h4 className="style-12">{item.name.bn}</h4>
                <p className="style-13">
                  {false ? "পিতার নামঃ" : "Fathers's name:"}{" "}
                  {item.fatherName.bn}
                </p>
                <p className="style-13">
                  {true ? "SID: " : "SID: "}
                  {item.sid}
                </p>
                <p className="style-13">
                  {false ? "মাতার নামঃ" : "Mother's name:"} {item.motherName.bn}
                </p>
                <p className="style-13">
                  {false ? "বয়সঃ" : "Age:"} {item.age.bn}
                </p>
                <p className="style-13">
                  {false ? "ঠিকানাঃ" : "Address:"} {item.country.bn}
                </p>
                <p className="style-13">
                  {false ? "পাশের সন" : "Year:"} {item.year.bn}
                </p>
                <p className="style-13">
                  {false ? "পেশাঃ" : "Profession:"} {item.profession.bn}
                </p>

                {item.comment ? (
                  <p className="style-13">
                    {false ? "অনুভূতিঃ " : "Comment:"} {item.comment}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {number == undefined ? (
        ""
      ) : (
        <ButtonComponent text="See More" link="/content/alemalema" />
      )}
    </div>
  );
}

export default AlemAlemaGrid;
