FROM python:alpine

ARG PORT=7777
ARG HOST='0.0.0.0'

ENV PORT=$PORT
ENV HOST=$HOST

COPY . /heyptt

WORKDIR /heyptt

RUN pip3 install -r ./requirements.txt --upgrade --no-cache-dir

EXPOSE $PORT

CMD ["python3", "serve.py"]
