import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { PageContainerWithNav } from '../component/PageContainerWithNav';
import { INDEX_CAROUSEL_IMG } from '../style/const';
import carouselImg0 from '/carousel/0.jpg'
import carouselImg1 from '/carousel/1.jpg'
import carouselImg2 from '/carousel/2.jpg'
import carouselImg3 from '/carousel/3.jpg'
export const IndexPage = () => {
    return (
        <PageContainerWithNav>
            <Carousel infiniteLoop={true} showStatus={false} showThumbs={false}>
                <img src={carouselImg0} style={{ width: INDEX_CAROUSEL_IMG.width, height: INDEX_CAROUSEL_IMG.height }} />
                <img src={carouselImg1} style={{ width: INDEX_CAROUSEL_IMG.width, height: INDEX_CAROUSEL_IMG.height }} />
                <img src={carouselImg2} style={{ width: INDEX_CAROUSEL_IMG.width, height: INDEX_CAROUSEL_IMG.height }} />
                <img src={carouselImg3} style={{ width: INDEX_CAROUSEL_IMG.width, height: INDEX_CAROUSEL_IMG.height }} />
            </Carousel>
        </PageContainerWithNav>
    )
}

