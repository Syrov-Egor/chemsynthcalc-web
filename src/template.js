export const appTemplate = `
    <div class="min-h-screen bg-gray-900 text-white">
        <!-- Top Navigation Bar -->
        <nav class="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-6">
                    <div class="relative group">
                        <button type="button" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            File
                        </button>
                        <div class="absolute hidden group-hover:block bg-gray-800 rounded-md shadow-lg z-10 w-32 border border-gray-700">
                            <button id="file-save" class="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Save</button>
                            <button id="file-load" class="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Load</button>
                        </div>
                    </div>
                   <div class="relative group">
    <button type="button" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
        Help
    </button>
    <div class="absolute hidden group-hover:block bg-gray-800 rounded-md shadow-lg z-10 w-32 border border-gray-700">
        <button id="help-about" class="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">About</button>
        <button id="help-howto" class="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">How to use</button>
    </div>
</div>
                </div>
                <div class="text-xl font-bold text-primary-400">
                    ChemSynthCalc v0.1.0
                </div>
            </div>
        </nav>
        
        <!-- Main Content -->
        <div class="flex flex-col h-[calc(100vh-4rem)]">
            <!-- Controls Panel -->
            <div class="bg-gray-800 border-b border-gray-700 p-6">
                <div class="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-9 gap-6">
                    <!-- Mode Selection -->
                    <div class="lg:col-span-1">
                        <label class="block text-sm font-medium text-gray-300 mb-3">Mode</label>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <input id="formula" type="radio" name="mode" value="formula" class="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500 focus:ring-2">
                                <label for="formula" class="ml-2 text-sm font-medium text-gray-300 cursor-pointer">Formula</label>
                            </div>
                            <div class="flex items-center">
                                <input id="balance" type="radio" name="mode" value="balance" class="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500 focus:ring-2">
                                <label for="balance" class="ml-2 text-sm font-medium text-gray-300 cursor-pointer">Balance</label>
                            </div>
                            <div class="flex items-center">
                                <input id="masses" type="radio" name="mode" value="masses" class="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500 focus:ring-2" checked>
                                <label for="masses" class="ml-2 text-sm font-medium text-gray-300 cursor-pointer">Masses</label>
                            </div>
                        </div>
                    </div>

                    <!-- Algorithm -->
                    <div class="lg:col-span-1">
                        <label for="algorithm" class="block text-sm font-medium text-gray-300 mb-3">Algorithm</label>
                        <select id="algorithm" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="auto">Auto</option>
                            <option value="inv">Inv</option>
                            <option value="gpinv">GPinv</option>
                            <option value="ppinv">PPinv</option>
                            <option value="comb">Comb</option>
                        </select>
                    </div>

                    <!-- Run Mode -->
                    <div class="lg:col-span-1">
                        <label for="runmode" class="block text-sm font-medium text-gray-300 mb-3">Run Mode</label>
                        <select id="runmode" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="balance">Balance</option>
                            <option value="check">Check</option>
                            <option value="force">Force</option>
                        </select>
                    </div>

                    <!-- Target Number -->
                    <div class="lg:col-span-1">
                        <label for="target-num" class="block text-sm font-medium text-gray-300 mb-3">Target #</label>
                        <div class="relative">
                            <input type="number" id="target-num" value="0" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                        </div>
                    </div>

                    <!-- Target Mass -->
                    <div class="lg:col-span-1">
                        <label for="target-mass" class="block text-sm font-medium text-gray-300 mb-3">Target Mass (g)</label>
                        <input type="number" id="target-mass" value="1.000000" min="0" step="1.000000" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    </div>

                    <!-- Intify Coefficients -->
                    <div class="lg:col-span-1">
                        <label class="block text-sm font-medium text-gray-300 mb-3">Intify Coefficients</label>
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="intify" class="sr-only peer" checked>
                            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            <span class="ms-3 text-sm font-medium text-gray-300">On</span>
                        </label>
                    </div>

                    <!-- Output Precision -->
                    <div class="lg:col-span-1">
                        <label for="output-precision" class="block text-sm font-medium text-gray-300 mb-3">Output Precision</label>
                        <input type="number" id="output-precision" value="4" min="0" max="20" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    </div>

                    <!-- Float Tolerance -->
                    <div class="lg:col-span-1">
                        <label for="float-tolerance" class="block text-sm font-medium text-gray-300 mb-3">Float Tolerance (1e-x)</label>
                        <input type="number" id="float-tolerance" value="8" min="1" max="15" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    </div>

                    <!-- Max Combinations -->
                    <div class="lg:col-span-1">
                        <label for="max-comb" class="block text-sm font-medium text-gray-300 mb-3">Max Combinations</label>
                        <input type="number" id="max-comb" value="15" min="1" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    </div>
                </div>
            </div>

            <!-- Equation Input Section -->
        <div class="bg-gray-800 border-b border-gray-700 p-6">
            <div class="flex flex-col sm:flex-row gap-4 items-end">
                <div class="flex-1">
                    <label for="equation-input" class="block text-sm font-medium text-gray-300 mb-2">Input</label>
                    <input type="text" id="equation-input" placeholder="H2+O2=H2O" 
                           class="bg-gray-700 border border-gray-600 text-white text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 font-mono">
                </div>
                <button type="button" id="run-button"
                        class="px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-all duration-200 flex items-center gap-2 min-w-fit">
                    <span id="button-icon">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                        </svg>
                    </span>
                    <span id="button-text">Run Calculation</span>
                </button>
            </div>
        </div>

            <!-- Results Section -->
            <div class="flex-1 bg-gray-900 p-6">
                <div id="results-section" class="h-full min-h-[200px]">
                    <div class="flex items-center justify-between mb-4">
                        <!-- Regular Results Header (shown by default) -->
                        <div id="regular-results-header" class="flex items-center justify-between w-full">
                            <h3 class="text-lg font-semibold text-gray-200">Results</h3>
                            <div class="flex items-center space-x-2">
                                <div id="status-indicator" class="w-3 h-3 bg-gray-500 rounded-full"></div>
                                <span id="status-text" class="text-sm text-gray-400">Ready</span>
                            </div>
                        </div>
                        
                        <!-- Spoiler Button (hidden by default, shown only in masses mode with successful results) -->
                        <button id="results-spoiler-button" onclick="toggleResultsSpoiler()" 
                                class="flex items-center justify-between w-full text-left hover:bg-gray-800 p-2 rounded-lg transition-colors"
                                style="display: none;">
                            <div class="flex items-center space-x-3">
                                <span id="results-spoiler-icon" class="text-gray-400 transition-transform duration-200" style="transform: rotate(0deg);">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                <h3 class="text-lg font-semibold text-gray-200">Results</h3>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div id="status-indicator-spoiler" class="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span id="status-text-spoiler" class="text-sm text-gray-400">Complete</span>
                            </div>
                        </button>
                    </div>
                    
                    <div id="results-spoiler-content" class="transition-all duration-300">
                        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                            <div id="results" class="p-4 h-full overflow-y-auto text-gray-300 font-mono text-sm leading-6 whitespace-pre-wrap">
Ready
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;