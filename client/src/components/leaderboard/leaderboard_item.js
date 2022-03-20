import { MdStar } from "react-icons/md";
import Format from "../../utils/Format";
import { AVATAR } from "../../utils/imageParams";
// import NavLink from "../navigation/navLink";

const format = new Format();
const LeaderBoardItem = ({ user, rank,points,borderClassName, pillClassName,categoryName}) => {
    return (
      <div className="leadership-item-container">
        <section className="leadership-ranks">
          <p>{rank}</p>
        </section>
  
        <section className="leadership-user">
          <section className="leadership-user-img">
            <AVATAR
            className={borderClassName}
            src={user.photo}
            alt="avatar of winner"
           />
          </section>
          <section className="leadership-user-info">
            <p>{user.username}</p>
            <small>{categoryName}</small>
          </section>
        </section>
        <section className="leadership-stats">
          <section className={`stats-pill ${pillClassName} `}>
            <span>
              <MdStar size={20} />
            </span>
            <p>{format.points(points)}</p>
          </section>
        </section>
      </div>
    );
};

export default LeaderBoardItem;