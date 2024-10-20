import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/atom/carousel"

interface IProps {
    children: React.ReactNode
}


const CardSlider = ({ children }: IProps) => {
    return (
        <Carousel>
            <CarouselContent>
                {children}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
        </Carousel>
    )
}

export default CardSlider