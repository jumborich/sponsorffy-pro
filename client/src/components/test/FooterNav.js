import {useSelector, useDispatch} from 'react-redux';
import {setActivePage, setCurrentType} from '../../redux/test/Actions';
import { GiRead } from 'react-icons/gi';
import {BsPencilSquare} from 'react-icons/bs';
import {MdRecordVoiceOver } from 'react-icons/md';
import {ImHeadphones } from 'react-icons/im';

const FooterNav = props => {

  const dispatch = useDispatch();
  const { currentType } = useSelector(state => state.test);
  
  const onPageChange = (type) =>{
              
    // 1) Set active page # to default
    dispatch(setActivePage('one'))

    // 2) Set current test type
    dispatch(setCurrentType(type))
  }
  return (
    <div id={props.id}>
    <div onClick={() => onPageChange('reading')} className="page-type-item" style={{backgroundColor:currentType === 'reading' ? '#122d7b':null,color:currentType === 'reading' ? 'white':'black',border:currentType === 'reading' ? 'none':null }}>
      <p><GiRead></GiRead></p>
      <p>Reading</p>
    </div>
    <div onClick={() => onPageChange('writing')} className="page-type-item" style={{backgroundColor:currentType === 'writing' ? '#122d7b':null,color:currentType === 'writing' ? 'white':'black',border:currentType === 'writing' ? 'none':null }}>
      <p><BsPencilSquare></BsPencilSquare></p> 
      <p>Writing</p>
    </div>
    <div onClick={() => onPageChange('listening')} className="page-type-item" style={{backgroundColor:currentType === 'listening' ? '#122d7b':null,color:currentType === 'listening' ? 'white':'black',border:currentType === 'listening' ? 'none':null }}>
      <p><ImHeadphones></ImHeadphones></p> 
      <p>Listening</p>
    </div>
    <div onClick={() => onPageChange('speaking')} className="page-type-item" style={{backgroundColor:currentType === 'speaking' ? '#122d7b':null,color:currentType === 'speaking' ? 'white':'black',border:currentType === 'speaking' ? 'none':null }}>
      <p><MdRecordVoiceOver></MdRecordVoiceOver></p> 
      <p>Speaking</p>
    </div>
    </div>
  )
}
export default FooterNav;