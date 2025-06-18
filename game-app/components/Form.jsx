import RegularButton from './RegularButton'
import Select from './Select'

export default function Form({ handleSubmit, handleChange }) {
    return (
        <div className="form-container">
            <div className="title-container">
                <h1><span>Memory</span></h1>
            </div>
            <p className="p--regular">
                Choose your style of cards and the level to play and improve your score.
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