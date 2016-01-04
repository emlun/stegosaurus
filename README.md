Stupid simple `steghide` webapp. Not secure at all.

Dependencies
---

The host system must provide the `steghide` command. Your Linux distribution
probably has a package by this name.


Usage
---

Install the dependencies and start the app.

    $ npm install
    $ npm start

Now `POST` an image file, a message file and a password to
`http://localhost:8080/hide`. The server will respond with a binary stream of
the image with the secret embedded. The following example reproduces the one
from [this guide][scottlinux]:

    $ curl -F the_image=@tux.jpg -F the_secret=@mytext.txt -F the_password=scottlinux http://localhost:8080/embed > stegtux.jpg

Alternatively, fire up `http://localhost:8080` in your browser and fill in the form.

 [scottlinux]: https://scottlinux.com/2014/08/12/steganography-in-linux-from-the-command-line/


Disclaimer
===

This software is, in its current incarnation, **NOT SECURE** in any sense of
the word. It was lazily whipped together in an hour as a fun proof of concept.
**DO NOT USE THIS SOFTWARE FOR ANYTHING YOU ACTUALLY NEED TO HIDE OR PROTECT**.
