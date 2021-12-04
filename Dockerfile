FROM python:alpine

ARG PORT=7777

ENV PORT=$PORT

COPY . /heyptt

WORKDIR /heyptt

RUN pip3 install -r ./requirements.txt --upgrade

EXPOSE $PORT

CMD ["python3", "serve.py"]
