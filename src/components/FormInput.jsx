
const FormInput = ({ Change, placeHolder, inputType, center }) => {
    return (
        <form>
            <div className={center ? 'flex justify-center' : ''}>
                <input type={inputType} 
                className="border-b-2 txt-2 border-current bg-zinc-800 
                            inputz text-4xl 
                            mt-10 focus: outline-0
                            pl-2 b-1 txt
                            w-3/5" 
                placeholder={placeHolder}
                onFocus={(e) => e.target.placeholder = ''}
                onBlur={(e) => e.target.placeholder = `${placeHolder}`}
                onChange={Change}/>
            </div>
        </form>
    )
}

export default FormInput