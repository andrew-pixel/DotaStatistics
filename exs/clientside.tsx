
const onSubmitForm = async e => {

    const [description, setDescsripton] = useState("");
    e.preventDefault();
    try {
        const body = {description};
        const response = await fetch("http://localhost:5000/todos",{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(body)
        });
        console.log(response);
    } catch (error) {
       console.error(error.message); 
    }
}