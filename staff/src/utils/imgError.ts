import errorImgUrl from '../assets/imgError.jpg'
export const handleImgError = (image: React.SyntheticEvent<HTMLImageElement, Event>) => {
    image.currentTarget.src = errorImgUrl
}