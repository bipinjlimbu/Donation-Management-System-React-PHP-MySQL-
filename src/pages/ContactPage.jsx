import myContact from '../style/ContactPage.module.css';

export default function ContactPage() {
    return (
        <div className={myContact.page}>
            <div className={myContact.header}>
                <h1>Get in Touch with ShareHope</h1>
                <p>We’re here to answer your questions and hear your feedback. Together, we can make a difference!</p>
            </div>

            <div className={myContact.cards}>
                <div className={myContact.card}>
                    <h2>Email</h2>
                    <p>support@sharehope.org</p>
                </div>
                <div className={myContact.card}>
                    <h2>Phone</h2>
                    <p>+1 (234) 567-890</p>
                </div>
                <div className={myContact.card}>
                    <h2>Address</h2>
                    <p>123 Hope Street, Kindness City, Country</p>
                </div>
            </div>

            <div className={myContact.footer}>
                <p>We value your feedback and are always here to help. Let's share hope together!</p>
            </div>
        </div>
    );
}
