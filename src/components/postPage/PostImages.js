import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

const PostImages = (props) => {
    const [imgShown, setImgShown] = useState(null)
    
    const images = props.imageLinks
    const imagesAmt = images.length
    useEffect(() => {
        if (imagesAmt > 0) setImgShown(images[0])
    }, [images, imagesAmt])
    const setToImgShown = (src) =>  {
        setImgShown(src)
    }
    

    const HIStyle = {
            borderColor: props.color,
            width: '100%'   
        }
    if (imagesAmt === 0) return null
    else if (imagesAmt  === 1) {
        return (
            <div className="PPC-pictures-container">
                <img style={HIStyle} className="PPC-pictures-highlight" src={imgShown} alt="highlight pic" />
            </div>
        )
    }
    else {
        const imageOptions = images.map(i => i === imgShown ?
            <img key={`img${i}`} onClick={() => setToImgShown(i)} className="PPC-pictures-instance" style={{borderColor: props.color}} src={i} alt="pic" />
            :
            <img key={`img${i}`} onClick={() => setToImgShown(i)} className="PPC-pictures-instance" style={{borderColor: '#282828'}} src={i} alt="pic" />
        )
        
        return (
            <div className="PPC-pictures-container">
                <img style={HIStyle} className="PPC-pictures-highlight" src={imgShown} alt="highlight pic" />
                <div className="PPC-all-pictures-container">
                    {imageOptions}
                </div>
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
// 	return {
//         
// 	}
// }
export default connect(
    null
)(PostImages)