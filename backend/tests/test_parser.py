import pytest
from app.services.parser import document_parser


def test_parse_txt_file():
    raw = b"Jane Doe\nRegistered Nurse\nEmail: jane.doe@hospital.org\nPhone: (555) 123-4567\n\nExperience\nMercy Hospital - Charge Nurse (2020-Present)\n- Managed 24-bed telemetry floor\n"
    text, ftype = document_parser.parse_file("sample.txt", raw)
    assert ftype == "txt"
    assert "Jane Doe" in text
    assert "Mercy Hospital" in text


def test_text_normalization():
    messy = "Jane\u00a0Doe \u2013 Lead\r\n\r\n\r\n\r\nEngineer    at  TechCorp"
    normalized = document_parser._normalize_text(messy)
    assert "Jane Doe - Lead" in normalized
    assert "Engineer at TechCorp" in normalized
    assert "\r" not in normalized
