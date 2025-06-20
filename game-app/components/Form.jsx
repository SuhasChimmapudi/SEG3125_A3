import RegularButton from './RegularButton'
import Select from './Select'

export default function Form({ handleSubmit, handleChange }) {
    return (
        <div className="form-container">
            <div className="title-container">
                <h1><span>Match & Remember </span></h1>
            </div>
            <p className="p--regular">
                Match pairs of cards in this fun memory game!<br/>
                Choose a category, then pick your difficulty
                to set the number of cards and put your memory to the test.
            </p>
            <form className="wrapper">
                <Select handleChange={handleChange} />
                <RegularButton handleClick={handleSubmit}>
                    Start Game
                </RegularButton>
            </form>
        </div>
    )
}