import csv


def read_csv_to_dict(csv_file):
    data_dict = {}
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            key = row[0]
            value = row[1]
            data_dict[key] = value
    return data_dict
