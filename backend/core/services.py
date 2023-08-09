import codecs
import csv
from datetime import date
from django.utils.dateparse import parse_datetime
from django.utils import timezone

from ninja import UploadedFile
from core.models import FileUploadRegister, ShiftRegister


def handle_csv_schedule(
    files: list[UploadedFile],
) -> tuple[list[FileUploadRegister], list[ShiftRegister]]:
    file_entries_created = []
    shift_entries_created = []

    for file_handler in files:
        csv_handler = csv.reader(codecs.iterdecode(file_handler, "utf-8-sig"))
        data = [row for row in csv_handler]
        header = data[0][0]
        rows = data[1:]
        if header != "matricula;data_marcacao;hora_marcacao":
            raise Exception(
                "CSV file is not in the correct format. First row should be 'matricula;data_marcacao;hora_marcacao"
            )

        file_entry = FileUploadRegister.objects.create(
            file=file_handler.name,
            number_of_entries=len(rows),
        )

        shifts_to_be_created = []
        for row in rows:
            matricula_colaborador, date, time = row[0].split(";")
            datetime = parse_datetime(f"{date} {time}")
            aware_datetime = timezone.make_aware(datetime)
            shifts_to_be_created.append(
                ShiftRegister(
                    file=file_entry,
                    matricula_colaborador=matricula_colaborador,
                    timestamp=aware_datetime,
                )
            )
        shift_entries = ShiftRegister.objects.bulk_create(shifts_to_be_created)
        file_entries_created.append(file_entry)
        shift_entries_created.append(shift_entries)

    return file_entries_created, shift_entries_created


def get_schedule_register_for_a_day(date_of_shift: date) -> list[ShiftRegister]:
    return list(ShiftRegister.objects.filter(timestamp__date=date_of_shift))


def get_file_register() -> list[FileUploadRegister]:
    return list(FileUploadRegister.objects.all())
