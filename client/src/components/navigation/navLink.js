import {Link,useLocation} from 'react-router-dom'

const NavLink =({to,inActiveClassName,className,activeClassName,...rest})=>{
    let location = useLocation();
  let isActive = location.pathname === to;

  let allClassNames = className + " " + (isActive ? `${activeClassName}` : `${inActiveClassName}`);
    
  return <Link className={allClassNames} to={to} {...rest} />;


}

export default NavLink;