import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Timer from "./Timer";

const TestNav = () => {
	const [ day, setDay ] = useState([]);
	const [ month, setMonth ] = useState([]);
	const [ year, setYear ] = useState([]);
  
  const { totalPoints, duration } = useSelector((state) => state.user.user.testSession);

	useEffect(() => {
		const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		let [ date, month, year ] = new Date().toLocaleDateString().split('/');

		setDay(date);
		setMonth(months[month - 1]);
		setYear(year);
	},[]);
	return (
		<div id="testNav" className="before-scroll">
			<ul>
				<li>
					<span>Date:</span> {month} {day}, {year}
				</li>
				<li>
					<span>Grading:</span> { totalPoints } points available
				</li>
				<li>
					<span>Duration:</span> { duration }  hours
				</li>

				<li>
					<span>Mode:</span> {(typeof window !== "undefined" && localStorage.getItem("testMode")) || ""}
				</li>
			</ul>
			<div className="testNav-timer">
			<Timer isChangeStyle={true}/>
			</div>

		</div>
	);
};

export default TestNav;