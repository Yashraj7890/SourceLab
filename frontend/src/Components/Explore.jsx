import React from "react";
import { useState } from "react";
import Repos from "./Repos";
import Spinner from "./Spinner";

const Explore = () => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [lang, setLang] = useState("");

  const exploreRepos = async (language) => {
   
    try {
      setLoading(true);
      setRepos([]);
      const res = await fetch(`http://localhost:5000/api/repos/${language}`);
      const data = await res.json();
      setRepos(data.repos);
      setLang(language);
    }
    catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="px-4">
      <div className="bg-gray-600/20 max-w-2xl mx-auto rounded-md p-4">
        <h1 className="text-xl font-bold text-center">
          Explore Popular Repositories
        </h1>
        <div className="flex flex-wrap gap-2 my-2 justify-center">
          <img
            src="/javascript.svg"
            alt="JavaScript"
            className="h-11 sm:h-20 cursor-pointer"
            onClick={() => exploreRepos("javascript")}
          />
          <img
            src="/typescript.svg"
            alt="TypeScript logo"
            className="h-11 sm:h-20 cursor-pointer"
            onClick={() => exploreRepos("typescript")}
          />
          <img
            src="/c++.svg"
            alt="C++ logo"
            className="h-11 sm:h-20 cursor-pointer"
            onClick={() => exploreRepos("c++")}
          />
          <img
            src="/python.svg"
            alt="Python logo"
            className="h-11 sm:h-20 cursor-pointer"
            onClick={() => exploreRepos("python")}
          />
          <img
            src="/java.svg"
            alt="Java logo"
            className="h-11 sm:h-20 cursor-pointer"
            onClick={() => exploreRepos("java")}
          />
        </div>
        {repos.length > 0 && (
          <h2 className='text-lg font-semibold text-center my-4'>
            <span style={{marginRight:"0.5rem"}}>
              {lang.toUpperCase()}
            </span>
           <span>Repositories</span>
          </h2>
        )}
        {!loading && repos.length > 0 && <Repos repos={repos} alwaysFullWidth/>}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default Explore;
