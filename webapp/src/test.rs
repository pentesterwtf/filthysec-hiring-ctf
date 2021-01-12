#[cfg(test)]
mod test {
    use super::rocket;
    use rocket::http::Status;
    use rocket::local::Client;

    #[test]
    fn front_page() {
        let client = Client::new(rocket()).expect("valid rocket instance");
        let mut response = client.get("/").dispatch();
        assert_eq!(response.status(), Status::Ok);
        /*
        assert_eq!(
            response.body_string(),
            Some("FilthySec: A totally real company, Written in ".into())
        );
        */
    }
}
