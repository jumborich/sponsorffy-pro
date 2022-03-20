import { useNavigate } from "react-router-dom";

const NotFound = () =>{
  const navigate = useNavigate();

  return(
    <div className="e-404">
      <p>Sorry..., but that page does not exist.</p>
      <button onClick={() => navigate(-1)}>
        Go back
      </button>
    </div>
  )
}

export default NotFound; 