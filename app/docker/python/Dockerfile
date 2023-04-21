FROM python:3.9-buster

COPY ./src /app
WORKDIR /app

RUN pip install -r /app/requirements.txt
RUN pip install --user --no-warn-script-location graphdb-python==0.0.6

ENTRYPOINT ["python"]

CMD ["api.py"]