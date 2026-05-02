import React, { useRef, useState, useContext } from 'react';
import EventItem from '../../../places/components/EventItem';
import Card from './Card';
import CustomButton from './CustomButton';
import "./Carousel.css"



const Carousel = (props) => {
  const [nowIndex, setNowIndex] = useState(0);
  const { dataArray, carouselPostWidth, carouselPostHeight, carouselPostMargin } = props
  const ref = useRef();


  const conputedLeft = () => {
    if (ref.current) {
      let leftSpan = parseInt(`${-nowIndex * parseInt(ref.current.clientWidth)}`)

      return {
        left: `${leftSpan - (16 * 2 * nowIndex)}px`
      }
    }
  }

  const changeImagePosition = (offset) => {
    setNowIndex(prev => {
      return (offset > 0) ? Math.min(dataArray.length, prev + offset) : Math.max(0, prev + offset)
    })
  }


  if (!dataArray || dataArray.length == 0) return (
    <div className="place-list center">
      <Card>
        <h2>No Events found.</h2>
      </Card>
    </div>
  );
  return (
    <div className='carouselContainer' >
      <div className="carouselArea">
        <div style={conputedLeft()} className="carouselPosts">
          {
            dataArray.map((place, index) => (
              <div key={index} ref={ref} className="carouselPostBox">
                <EventItem
                  id={place.id}
                  title={place.title}
                  description={place.description}
                  address={place.address}
                  coordinates={place.coordinates}
                  host={place.host}
                  capacity={place.capacity}
                  numOfParticipants={place.numOfParticipants}
                  participants={place.participants}
                  onDelete={props.onDeletePlace}
                  isRequested={props.isRequested}
                  onLike={props.onLike}
                  showFull={false}
                  card
                />
              </div>
            ))
          }
        </div>
      </div>

      <div onClick={() => changeImagePosition(-1)} className="controlLeft"><i className="fa fa-angle-left" /></div>
      <div onClick={() => changeImagePosition(1)} className="controlRight"><i className="fa fa-angle-right" /></div>
    </div >
  )
};

export default Carousel;