# FilthySec

![Filthy Security](filthysec-logo.png?raw=true)

## Admin

* A hiring challenge for new employees.
* A little scenario
* Multiple steps involved, multiple linked apps
* Built to see if people can:
  * a: Do "hacking"
  * b: Think of adjacent systems (i.e. signs of lateral movement)
* This parent repo isn't designed for the applicant to see
* The application ends up seeing most things under `app*`
## Scenario

* We're Russian/Chinese/Whatever APT
* We are sick of Australia and it's Kangaroos
* We want to take out the places that run their critical infrastructure


We're doing this by taking on the big security companies in Australia, starting with FilthySec. FilthySec, according to their website is:

* The #1 Cybersecurity Provider
* "We deliver innovative and effective cyber and IT security solutions for some of Australia's largest and most well-known organisations."

Let's cause some issues and break in, and see what we can do.

### Goals

* Assessment
  * Figure out if someone can do hacking, by giving them a target we can observe them attacking
  * Small, can be done in somewhere between 30 minutes to an hour for a junior, probably minutes for a senior
  * See if they're a culture fit
* For the assessing team
  * Make this easy to observe, and easy to grade
  * No silly tricks that means someone needs to sit there for hours to remember how to do a padding oracle attack
  * Can be spun up quickly

### Intended Path

* You can get RCE
* The first webapp is to figure out if they can use devtools / it's got minimal complexity
* If they do this part wrong, don't hire
* Second app is the `/api`, which lets you do slightly more complex things
  * They're meant to get here from the first app when they try to register
* Both apps sit behind nginx
* The point is to see a pre-auth hint to `/api`, with exposed API docs, then fiddle with the `convert` and `exec` functions to bypass a filter
* Given how junior these people are, I want to see them do recon and their thoughts about a system, rather than cool exploitation

#### webapp

* Silly webapp, written in Rust
* Not meant to be too hard
* Some XSS
  * This isn't meant to be exciting or hard
  * If they fuck up here, do not hire them
* Links to an admin portal

##### /newclient-confirm

* Little registration page for new customers
  * XSS in two out of three fields
  * The email field gets client side validated, but can be bypassed
  * The budget drop down has xss
  * The description field does not have XSS, because that's too easy
* We just want to see them open dev tools or talk their way through it
* Ask about exploitation of this

* Second bug is the 'back' button
  * Notice it's an open redirect

##### newclient/<email>

* No XSS in the email parameter
  * It's just a parameter so hopefully they have a look at that
* Technically the pages before this don't matter
  * Curious if they make that assertion, if they're tracking flow, etc  


##### /goto/<URL>

* Redirect only on our own site
* Referenced in the newclient-confirm page
* Probably not exploitable, see what they do with it, if they try to treat it like an open redirect first


##### 404 handler

* bunch of weird info disclosed, says "debug"
* Headers reflected
* 'XSS', but probably not the fun exploitable kind (i.e. XSS in User-Agent field)
* See if they comment on the client IP bit, comments about X-FORWARDED-FOR / X-Real-IP, etc
  * Bonus points - X-Real-IP is what this rustlang framework actually relies on :)


##### /joinus

* File upload and some basic parsing
  * Not checking filetype that gets uploaded
  * Weird javascript that converts file to base64, then pumps into form
  * Denial of service for upstream if file is too large
* Will dump file to location
  * Hint is the debug string that comes back
  * Can get it to pump out to different locations
  * expected poc - something like a filename of "../static/whatever"
  * Won't give you RCE, but will let you dump stuff
  * Caveat, might give you RCE if you knew how the backend worked / tera, but not an expected outcome

### TODO - Things to implement

* a .git folder being reachable from the webapp
  * Make it fake, but let's see if anyone notices
* Some XSS
* Some hardcoded secrets
* Some hardcoded signing keys or something


* Some silly shit which asks for a email address before giving you a PDF
* A utility that screenshots a website for you (SSRF)
  * But it doesn't allow localhost/bunch of common ones
  * Lets see what they try to bypass
* a report generation service which has SSRF (Generates a PDF)
  * This thing generates a bullshit report for a client name / TLS findings / whatever
* An API that lets you do super privileged stuff, but only from localhost
  * Chain the SSRF, or set X-FORWARDED-FOR
* an exposed `swagger` like interface to show the API calls you can make
* have a couple unprivileged ones
* unsigned JWT, you can log in to a demo thing with `demo:demo` and change the assertion to say you're an admin or something