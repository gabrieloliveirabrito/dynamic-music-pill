.PHONY: all build build-js locale schema install clean zip

all: build

build:
	pnpm run build

build-js:
	pnpm run build:js

locale:
	pnpm run build:locale

schema:
	pnpm run build:schema

install:
	./install.sh

zip:
	./build.sh

clean:
	pnpm run clean
	rm -f schemas/gschemas.compiled
	find locale -name '*.mo' -delete 2>/dev/null || true
