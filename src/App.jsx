import Navbar from "./components/Navbar";
import Header from "./components/Header";
import SearchBar from "./components/Searchbar";
import JobCard from "./components/JobCard";
import { useState, useEffect } from "react";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "./firebase.config";

function App() {
  const [jobs, setJobs] = useState([]);
  const [customSearch, setCustomSearch] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});

  const fetchJobs = async () => {
    setCustomSearch(false);
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, orderBy("postedOn", "desc"));
    const req = await getDocs(q);
    const jobsData = req.docs.map((job) => ({
      ...job.data(),
      id: job.id,
      postedOn: job.data().postedOn.toDate(),
    }));
    setJobs(jobsData);
  };

  const fetchJobsCustom = async (criteria) => {
    setCustomSearch(true);
    setSearchCriteria(criteria);
    const jobsRef = collection(db, "jobs");
    let q = jobsRef;

    Object.keys(criteria).forEach((key) => {
      if (criteria[key]) {
        q = query(q, where(key, "==", criteria[key]));
      }
    });

    q = query(q, orderBy("postedOn", "desc"));
    const req = await getDocs(q);
    const jobsData = req.docs.map((job) => ({
      ...job.data(),
      id: job.id,
      postedOn: job.data().postedOn.toDate(),
    }));
    setJobs(jobsData);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <Navbar />
      <Header />
      <SearchBar fetchJobsCustom={fetchJobsCustom} />
      {customSearch && (
        <button
          onClick={fetchJobs}
          className="flex pl-[1250px] mb-2"
        >
          <p className="bg-blue-500 px-10 py-2 rounded-md text-white">
            Clear Filters
          </p>
        </button>
      )}
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}

export default App;