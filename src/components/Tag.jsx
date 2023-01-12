import { faXmarkCircle  } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Tag = (props) => {
    return (
        <div className="flex border rounded-3xl py-2 px-2 ml-2">
            <p className="txt text-2xl mr-2">{props.tagName}</p>
            <FontAwesomeIcon icon={faXmarkCircle} className="txt text-2xl hover:text-white mt-1" onClick={() => props.func(props.tagName)}/>
        </div>
    )  
}

export default Tag