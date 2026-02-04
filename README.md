<p align="center"> <img src="https://github.com/DK-Code1/simpsons-image-search/blob/main/src/assets/logo.png"/> </p>

# Simpsons image search

Small website that allows users to find any simpsons series scenes by uploading an image.
It uses buscasimpsons and frinkiac as backend.

![Guide image](https://github.com/DK-Code1/simpsons-image-search/blob/main/guide.gif)


# Features
 - Frinkiac support.
 - Buscasimpsons support.
 - Up to season 20.
 - Almost all simpsons frames can be found (99.9%).
 - Upload any image or use an URL.

# How does it works
- The main API is publicly hosted at buscasimpsons website.
- API has visual features (extracted with ResNet) of all frames of the simpsons series.
- It uses FAISS to do similarity search of any input image and returns an array of similarity (closest first).
- This website uses that data to map the results into buscasimpsons or frinkiac links.
- Frinkiac support was achieved with an [unofficial api](https://frink.readme.io/reference/welcome), so it finds the closest frame available at frinkiac.
