import numpy as np
import cv2
import matplotlib.pyplot as plt
cv2.namedWindow('image', cv2.WINDOW_NORMAL)
cv2.resizeWindow('image', 800, 600)

# Wczytaj obrazek z pliku z różnymi opcjami
img = cv2.imread('./water_coins.jpg', cv2.IMREAD_GRAYSCALE)

cv2.imshow('image', img)
cv2.waitKey(0)

# Zapisz plik docelowy na dysku
# cv.imsave()

cv2.destroyAllWindows()