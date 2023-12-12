import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bars } from "react-loader-spinner";

export default function FetchNews() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("programming");
  const [text, setText] = useState("");
  const [largeTitle, setLargeTitle] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // loading state

  useEffect(() => {
    setIsLoading(true);

    const fetchNews = async () => {
      const url = `https://hn.algolia.com/api/v1/search?query=${query}`;
      const res = await fetch(url);
      const data = await res.json();
      // You can change the number of items you get back in your response using
      // the `Array.length` method, as demonstrated below. Uncomment the line and
      // reload your app to see it in action.
      // data.hits.length = 10
      setItems(data.hits);
      setLargeTitle(data.hits[0]);
    };

    fetchNews();
    setIsLoading(false);
  }, [query]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!text) {
      console.log("Input is empty");
    } else {
      setQuery(text);
      setText("");
      console.log(text);
      console.log(query);
    }
  };
  //@ts-ignore
  const hnsrc = largeTitle?.url;
  return (
    <>
      <main>
        {isLoading ? (
          <Bars
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <>
            {/* Search form */}
            <form
              onSubmit={handleSubmit}
              className="flex place-items-center container mx-auto lg:max-w-4xl mt-10 px-5"
            >
              <Input
                type="text"
                name="text"
                id="text"
                placeholder="Search for something..."
                autoComplete="off"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full py-2 px-4 rounded bg-transparent border border-gray-700 focus:border-gray-600 transition-all duration-150 outline-none text-gray-900 placeholder-gray-950 lg:pb-4 mr-5"
              />
              <Button type="submit" onClick={handleSubmit}>
                Search
              </Button>
            </form>
            {/* End of search form */}

            <article className="my-10 flex flex-col items-center justify-center container lg:max-w-4xl mx-auto px-5">
              <h1 className="font-bold text-center text-4xl my-5 text-gray-700 lg:text-6xl">
                {/* @ts-ignore*/}
                {largeTitle?.title}
              </h1>
              <a
                href={hnsrc}
                target="_blank"
                rel="noreferrer"
                className="border-b border-gray-700 text-gray-600 text-lg hover:text-gray-900 hover:border-gray-900"
              >
                Read Full Story
              </a>
            </article>

            <article className="container mx-auto lg:max-w-4xl px-5">
              <p className="text-gray-800">
                Category:{" "}
                <span className="font-bold text-gray-600 capitalize">
                  {query}
                </span>
              </p>
            </article>

            <section className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 container mx-auto lg:max-w-4xl">
              {items.map((item) => {
                const { author, created_at, objectID, title, url } = item;

                return (
                  <article
                    key={objectID}
                    className="bg-gradient-to-br from-gray-400 via-gray-300 to-gray-100 p-3 transition-all duration-150 rounded-3xl"
                  >
                    <h3 className="font-bold text-gray-700 text-lg mb-3">
                      {title}
                    </h3>
                    <article className="flex items-center justify-between">
                      <p className="text-gray-800">
                        By <em>{author}</em>
                      </p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopenner noreferrer"
                        className="border-b border-gray-700 text-gray-600 text-lg hover:text-gray-900 hover:border-gray-900"
                      >
                        Read More
                      </a>
                    </article>
                    <p className="text-gray-950 mt-10">
                      {/* Format date using the `format` method from `date-fns` */}
                      {format(new Date(created_at), "dd MMM yyyy")}
                    </p>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </main>
    </>
  );
}
