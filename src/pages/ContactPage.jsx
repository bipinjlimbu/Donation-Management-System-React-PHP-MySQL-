import myContact from '../style/ContactPage.module.css';

export default function ContactPage() {
    return (
        <div className={myContact.about}>
            <h1>Contact Us</h1>
            <p>If you have any questions, suggestions, or need assistance, please feel free to reach out to us.</p>
            <p>Email: dms@gmail.com </p>
            <p>Phone: +123-456-7890</p>
            <p>Address: 123 Donation St, Kindness City, Country</p>
            <p>We value your feedback and are here to help!</p>
        </div>
    );
}