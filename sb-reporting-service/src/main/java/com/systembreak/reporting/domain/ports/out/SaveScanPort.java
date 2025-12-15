package com.systembreak.reporting.domain.ports.out;

import com.systembreak.reporting.domain.model.Scan;

public interface SaveScanPort {

    Scan saveScan(Scan scan);
}
