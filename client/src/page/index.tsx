import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { PageContainer } from '../component/PageContainer';
import { INDEX_CAROUSEL_IMG } from '../style/const';

const CarouselItemContainer = (props: { imgIndex: number }) => {
    return (
        <img src={`/carousel/${props.imgIndex}.jpg`} style={{ width: INDEX_CAROUSEL_IMG.width, height: INDEX_CAROUSEL_IMG.height }} />
    )
}
export const IndexPage = () => {
    return (
        <PageContainer>
            <Carousel infiniteLoop={true} showStatus={false} showThumbs={false}>
                <CarouselItemContainer imgIndex={0} />
                <CarouselItemContainer imgIndex={1} />
                <CarouselItemContainer imgIndex={2} />
                <CarouselItemContainer imgIndex={3} />
            </Carousel>
        </PageContainer>
    )
}

