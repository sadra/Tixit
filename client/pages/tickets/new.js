const NewTicket = () => {
    return (
        <div>
            <h1>Create a Ticket</h1>
            <from>
                <div className="form-group">
                    <label>Title</label>
                    <input className="form-control" />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input className="form-control" />
                </div>
                <button className="btn btn-primary">Submit</button>
            </from>
        </div>
    )
}

export default NewTicket