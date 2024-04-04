import toast from "react-hot-toast";
import React, { useEffect } from "react";
import SortRepo from "./SortRepo";
import Repos from "./Repos";
import ProfileInfo from "./ProfileInfo";
import Search from "./Search";
import { useState, useCallback } from "react";
import Spinner from "./Spinner";
const Home = () => {
	const [userProfile, setProfile] = useState("");
	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [sortType, setType] = useState("forks");

	const getProfileAndRepos = useCallback(async (username = "Yashraj7890") => {

		try {
			const res = await fetch(`https://sourcelab.onrender.com/api/profile/${username}`);
			const { profile, rR } = await res.json();
			rR.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
			setRepos(rR);
			setProfile(profile);
			setLoading(false);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		getProfileAndRepos();
	}, [getProfileAndRepos]);

	const onSearch = async (e, username) => {
		e.preventDefault();
		setLoading(true);
		setRepos([]);
		setProfile(null);
		const { profile, rR } = await getProfileAndRepos(username);
		setProfile(profile);
		setRepos(rR);
		setLoading(false);
	}
	const onSort = (sortType) => {
		setType(sortType)
		if (sortType === "recent") {
			repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		} else if (sortType === "stars") {
			repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
		} else if (sortType === "forks") {
			repos.sort((a, b) => b.forks_count - a.forks_count);
		}
		setRepos([...repos]);
	}
	return (
		<div className='m-4'>
			<Search onSearch={onSearch} />
			<SortRepo onSort={onSort} sortType={sortType} />
			<div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
				{userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
				{!loading && <Repos repos={repos} />}
				{loading && <Spinner />}
			</div>
		</div>
	);
};

export default Home;
