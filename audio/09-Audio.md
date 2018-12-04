# Kierunki rozwoju Oprogramowania #
## Przetwarzanie Sygnałów Audio ##
#### Zapraszam na stronę http://dillinger.io/ - wklej tam treść pliku
#### Krótkie przypomnienie SciPy, NumPy ####

``` python
import scipy as sc
import numpy as np
import thinkdsp
import thinkplot
import matplotlib.pyplot as plt
```
Jeżeli jedna z powyższych komend się nie powiedzie należy zaktualizować bazę danych o paczkach, a następnie zainstalować brakującą paczkę
```bash
sudo apt-get update
sudo apt-get install python3-scipy python3-numpy python3-pip
```

Paczki **thinkplot** i **thinkdsp** należy zainstalować poleceniem

```bash
sudo pip3 install thinkx
```

Jeżeli któraś z paczek nie została odnaleziona należy dodać repozytorium `universe` i `multiverse`, a następnie powtórzyć polecenia z poprzedniego akapitu.

```bash
sudo apt-add-repository universe
sudo apt-add-repository multiverse
```

#### Jupyter Notebook, ThinkDSP ####

Aby uruchomić `jupyter'a` należy przejść w linii poleceń do folderu z projektem a następnie wydać polecenie `jupyter-notebook`. W zakładce otwartej w przeglądarce należy kliknąć na wybrany projekt albo stworzyć nowy.


#### Wprowadzenie do ThinkDSP ####
Paczka pozwala na bardzo proste tworzenie, analizowanie i przetwarzanie sygnałów audio zarówno w dziedzinie przestrzennej jak i częstotliwościowej. Poniżej znajduje się przykład syntezy dwóch sygnałów. Przeanalizuj poniższy kod. Poeksperymentuj z parametrami.

``` python
import thinkdsp
import thinkplot
%matplotlib inline
import warnings
warnings.filterwarnings('ignore')
cos_sig = thinkdsp.CosSignal(freq=440, amp=1.0, offset=0)
sin_sig = thinkdsp.SinSignal(freq=880, amp=0.5, offset=0)
cos_sig.plot()
sin_sig.make_wave(duration=0.007).plot()
thinkplot.config(xlabel='Time (s)')
mix = cos_sig + sin_sig
sin_sig.make_wave().make_audio()
# cos_sig.make_wave().make_audio()
# Wklej ponizszy kod do osobnego bloku
mix = sin_sig + cos_sig
mix.make_wave(duration=0.007).plot()
wave = mix.make_wave()
wave.make_audio()
```
Co prawda dobrze wiemy jak będzie wyglądało spektrum powyższego sygnału, jednak nie zaszkodzi sprawdzić czy teoria zgadza się z praktyką.

``` python
spectrum = wave.make_spectrum()
spectrum.plot()
thinkplot.config(xlabel='frequency (Hz)', legend=False)
```

Moduł pozwala na generowanie wielu bazowych typów sygnałów.

``` python
saw_sig = thinkdsp.SawtoothSignal(freq=440)
saw_sig.plot()
saw_wave = saw_sig.make_wave(duration=0.5)
saw_wave.make_audio()
```

Wygeneruj sygnał składający się z sinusa i cosinusa o 3 różnych częstotliwościach (ale takich aby wyższe częstotliwości były harmonicznymi częstotliwości podstawowej). Posłuchaj jak brzmi wynikowa fala. Następnie powtórz zadanie, ale tak dobierz częstotliwości, żeby jedna z nich nie była wielokrotnością częstotliwości podstawowej. Czy zauważasz różnicę w postrzeganiu dźwięku? Jak ją wytłumaczysz?

#### Spektrum i własne sygnały

Zanim wkleisz poniższy kod, zastanów się jak wygląda spektrum takiego sygnału

``` python
saw_wave.make_spectrum().plot()
```
Jaka w tym wypadku jest częstotliwość dominująca, a jaka podstawowa? Jeżeli nie jesteś pewien zawsze możesz posłużyć się odpowiednią funkcją to znalezienia lokalnych maksimów.

``` python
spectrum.peaks()[:2]
```
Definiowanie własnych sygnałów nie jest trudne. Należy jedynie zadbać o to aby tworzona klasa posiadała funkcję `_evaluate`. Pod spodem przykładowa klasa.

``` python
import math
PI2 = 2 * math.pi

class SawtoothChirp(thinkdsp.Chirp):
    """Represents a sawtooth signal with varying frequency."""

    def _evaluate(self, ts, freqs):
        """Helper function that evaluates the signal.

        ts: float array of times
        freqs: float array of frequencies during each interval
        """
        dts = np.diff(ts)
        dps = PI2 * freqs * dts
        phases = np.cumsum(dps)
        phases = np.insert(phases, 0, 0)
        cycles = phases / PI2
        frac, _ = np.modf(cycles)
        ys = thinkdsp.normalize(thinkdsp.unbias(frac), self.amp)
        return ys
```

``` python
signal = SawtoothChirp(start=220, end=880)
wave = signal.make_wave(duration=2, framerate=10000)
segment = wave.segment(duration=0.06)
segment.plot()
wave.make_audio()
```

Odczyt i zapis plików audio jest jedną z bardziej pożądanych funkcji, stąd nie zabrakło interfejsu pozwalającego na łatwą realizację wymienionych funkcji. Poniżej przykład odczytu pliku.

``` python
gunshot_response = thinkdsp.read_wave('180960__kleeb__gunshot.wav')
gunshot_response = response.segment(start=0.12)
gunshot_response.shift(-0.12)

gunshot_response.normalize()
gunshot_response.plot()
thinkplot.config(xlabel='time (s)', ylabel='amplitude', ylim=[-1.05, 1.05], legend=False)
gunshot_response.make_audio()
```

Tutaj przykład innego dźwięku

``` python
wave = thinkdsp.read_wave('92002__jcveliz__violin-origional.wav')
start = 0.11
wave = wave.segment(start=start)
wave.shift(-start)

wave.truncate(len(response))
wave.normalize()
wave.plot()
thinkplot.config(xlabel='time (s)', ylabel='amplitude',  ylim=[-1.05, 1.05], legend=False)
wave.make_audio()

```

Napisz funkcję która na podstawie przekazywanego parametru będzie rozciągała sygnał audio (może też dokonywać operacji odwrotnej jeżeli parametr będzie mniejszy od 1).
`Wskazówka:` sprawdź jakie pola ma obiekt utworzony przez wczytywanie pliku audio. Należy zmienić 2 z nich.

#### Systemy LTI

Korzystając z teorii systemów LTI możemy wykorzystać dźwięk wystrzału i uznać go za model naszego kanału transmisyjnego. Spróbujemy teraz ustalić jak brzmiałyby skrzypce w pomieszczeniu w którym dokonano wystrzału (Bądź cierpliwy, operacja może trwać dłuższą chwilę).
``` python
output = wave.convolve(gunshot_response)
output.normalize()
wave.plot(label='original')
output.plot(label='convolved')
thinkplot.config(xlabel='time (s)', ylabel='amplitude', ylim=[-1.05, 1.05])
```
A teraz przekonajmy się czy efekt brzmi wiarygodnie
``` python
output.make_audio()
```

#### Analiza częstotliwościowa

W niektórych przypadkach chcielibyśmy dokonać analizy częstotliwościowej dla dłuższych fragmentów audio. Z wiadomych przyczyn może to być kłopotliwe (cięcie na mniejsze fragmenty i plotowanie ich jeden pod drugim). Zamiast podejścia stosowanego w poprzednich przykładach można wykorzystać spektrogram.

``` python
wave = thinkdsp.read_wave('100475__iluppai__saxophone-weep.wav')
wave.normalize()
wave.make_audio()
```
W osobnym bloku
``` python
gram = wave.make_spectrogram(seg_length=1024)
gram.plot(high=3000)
thinkplot.config(xlabel='Time (s)', ylabel='Frequency (Hz)')
```
Przeprowadź analizę częstotliwościową segmentu o długości 0.5 sekundy startującego w 2 sekundzie. Znajdź wszystkie harmoniczne funkcją `peaks`. Czy i w tym przypadku częstotliwość podstawowa i dominująca jest taka sama?

Wygeneruj sygnał trójkątny o częstotliwości równej częstotliwości podstawowej analizowanego sygnału. Porównaj ich brzmienie. Zauważ, że na brzmienie dźwięku ogromny wpływ ma właśnie częstotliwość podstawowa, nawet jeżeli nie jest ona dominująca.

#### Filtrowanie

W prezentowanym module dostępne są funkcje realizujące filtrowanie górnoprzepustowe, dolnoprzepustowe i pasmowe. Każda z funkcji im odpowiadających jako argument przyjmuje częstotliwość graniczną (filtr pasmowy przyjmuje 2 argumenty). Sprawdźmy jak będzie brzmiał fragment nagrania z poprzedniego ćwiczenia po filtracji górnoprzepustowej z częstotliwością 600 Hz.

Załóżmy że zmienna `segment` jest fragmentem uzyskanym w poprzednim zadaniu (start w 2 sekundzie, długość 0.5 sekundy)

``` python
spectrum2 = segment.make_spectrum()
spectrum2.high_pass(600)
spectrum2.plot(high=3000)
thinkplot.config(xlabel='Frequency (Hz)', ylabel='Amplitude')
```
``` python
segment2 = spectrum2.make_wave()
segment2.make_audio()
```

Słyszalna wysokość dźwięku wciąż wynosi 464 Hz pomimo że w sygnale nie ma takiej składowej. To zjawisko brakującej częstotliwości podstawowej jest dobrze opisane w literaturze (także na wikipedii - https://en.wikipedia.org/wiki/Missing_fundamental)

Dzieje się tak dlatego że w sygnale wciąż występują wyższe częstotliwości które są harmonicznymi 464Hz. Aby się ich pozbyć przeprowadź filtrowanie dolnoprzepustowe z częstotliwością graniczną 1200Hz. Sprawdź czy po tej operacji zmieniła się barwa dźwięku.

#### Zadania końcowe

Wygeneruj sygnał prostokątny, piłokształtny i trójkątny. Przeprowadź analizę częstotliwościową i sprawdź jak zachowują się kolejne składowe harmoniczne w analizowanych sygnałach (które z nich są obecne, jak maleje ich amplituda).
