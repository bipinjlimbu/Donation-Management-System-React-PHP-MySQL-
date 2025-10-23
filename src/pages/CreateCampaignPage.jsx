

export default function CreateCampaignPage () {
    return (
        <div>
            <h1> Create Campaign </h1>
            <form>
                <label> Campaign Name: </label>
                <input type="text" required/>
                <label> Campaign Description: </label>
                <textarea name="campaign_description" required />
                <label> Item Type: </label>
                <input type="text" required/>
                <label> Item Category: </label>
                <input type="text" required/>
                <label> Targeted Quantity: </label>
                <input type="number" required/>
                <label> Location: </label>
                <input type="text" required/>
                <label> End Date: </label>
                <input type="date" required/>
                <button type="submit"> Create </button>
            </form>
        </div>
    )
}